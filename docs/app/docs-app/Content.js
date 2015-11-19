import {createClass, default as React} from 'react';
import {findDOMNode} from 'react-dom';
import appStateStore from './appState.store';
import {Observable} from 'rx';
import Paper from 'material-ui/lib/paper';
import marked from 'marked';
import codeExampleRunner from 'd2-code-example-runner';
import CircularProgress from 'material-ui/lib/circular-progress';
import AppBar from 'material-ui/lib/app-bar';

function MethodName(props) {
    const renderParams = (m) => {
        return m.params && m.params.map(param => {
                return (
                    <span key={param.name}>{param.name} <span style={{fontSize: '1.2rem'}}>{getTypeHint(param.typeExpression)}</span></span>
                );
            });
    };

    const methodNameStyle = {
        fontSize: '1.5rem',
        padding: '1rem',
    };

    return (<Paper zDepth={0} style={methodNameStyle}>{props.method.method}({renderParams(props.method)})</Paper>);
}

const Method = createClass({
    propTypes: {
        definition: React.PropTypes.object.isRequired,
    },

    render() {
        const method = this.props.definition;

        if (!method) {
            return null;
        }

        const methodClass = {
            marginBottom: '1rem',
        };

        return (
            <Paper style={methodClass}>
                <MethodName method={method} />
                <div style={{padding: '.5rem 1rem'}}>
                    <div style={{color: '#CCC'}}>returns</div>
                    <div>{getTypeHint(method.returns.typeExpression)} {method.returns.description}</div>
                </div>
                <div style={{padding: '.5rem 1rem'}} dangerouslySetInnerHTML={runMarked(method.description)}></div>
            </Paper>
        );
    },
});

function Methods(props) {
    const methods = props.methods;

    if (!Array.isArray(methods) || !methods.length) {
        return <span />;
    }

    return (
        <section>
            <AppBar style={{marginBottom: '1rem'}} title="Methods" showMenuIconButton={false} />
            {methods.map(method => {
                return (
                    <Method key={method.method} definition={method} />
                );
            })}
        </section>
    );
}

function Functions(props) {
    const functions = props.functions;

    if (!Array.isArray(functions) || !functions.length) {
        return <span />;
    }

    return (
        <section>
            <AppBar style={{marginBottom: '1rem'}} title="Functions" showMenuIconButton={false} />
            {functions
                .map(method => Object.assign({}, method, {method: method.function}))
                .map(method => {
                return (
                    <Method key={method.function} definition={method} />
                );
            })}
        </section>
    );
}

function Properties(props) {
    const properties = props.properties;

    if (!Array.isArray(properties) || !properties.length) {
        return <span />;
    }

    return (
        <section>
            <AppBar style={{marginBottom: '1rem'}} title="Properties" showMenuIconButton={false} />
            {properties.map((property, index) => {
                const propertyClass = {
                    padding: '1rem',
                    marginBottom: '1rem',
                };
                return (
                    <Paper key={'properties_' + index} style={propertyClass}>
                        <div>{property.name}</div>
                        <div>{property.description}</div>
                        <div dangerouslySetInnerHTML={runMarked(property.extraInfo)}></div>
                    </Paper>
                );
            })}
        </section>
    );
}

function Page(props) {
    if (props.page.docType !== 'md') {
        return (<span />);
    }

    return (
        <section dangerouslySetInnerHTML={runMarked(props.page.description)}></section>
    );
}

function runMarked(markdown) {
    return {
        __html: marked(markdown),
    };
}

function getTypeHint(typeExpression) {
    let typeExpressionClass;

    if (!typeExpression) {
        typeExpression = 'any';
    }

    if (/^{.+}$/.test(typeExpression)) {
        typeExpressionClass = 'type-hint-object';
        typeExpression = 'Object' + typeExpression;
    } else {
        if (/^\[.+\]$/.test(typeExpression)) {
            typeExpressionClass = 'type-hint-array';
            typeExpression = 'Array' + typeExpression;
        } else {
            typeExpressionClass = 'type-hint-' + typeExpression.replace(/[\W]/gi, '').toLowerCase();
        }
    }

    if (typeExpression) {
        return <span className={'type-hint ' + typeExpressionClass}>{typeExpression || '*'}</span>;
    }
    return null;
}

export default createClass({
    getInitialState() {
        return {
            nav: {},
            loading: true,
        };
    },

    componentWillMount() {
        appStateStore
            .map((pageLocation) => {
                const request = fetch(`./sources/${pageLocation}`)
                    .then(reponse => reponse.json())
                    .catch(() => ({}))

                return Observable.fromPromise(request);
            })
            .concatAll()
            .subscribe((pageData) => {
                this.setState({
                    content: pageData,
                    loading: false,
                });
            });

        codeExampleRunner.init('examplerunner.js', {
            url: 'https://apps.dhis2.org/dev/api',
        });
    },

    componentDidUpdate() {
        Array.from(findDOMNode(this).querySelectorAll('code[class^=lang-'))
            .map(element => {
                element.classList.add('d2-code-example');
            });

        codeExampleRunner.all();
    },

    render() {
        if (this.state.loading) {
            return (
                <CircularProgress mode="indeterminate" size={1.5} />
            );
        }

        const content = this.state.content;

        return (
            <main>
                <h1>{content.name}</h1>
                <h3>{content.moduleName}</h3>
                <Properties properties={content.properties} />
                <Methods methods={content.methods || []} />
                <Functions functions={content.functions || []} />
                <Page page={content} />
                <pre>
                    {/*JSON.stringify(this.state.content, undefined, 4)*/}
                </pre>
            </main>
        );
    },
});
