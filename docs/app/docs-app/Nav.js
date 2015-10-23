import {createClass, default as React} from 'react';
import {navigateTo} from './navigation.actions';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menu/menu-item';
import FontIcon from 'material-ui/lib/font-icon';
import {Observable} from 'rx';
import CircularProgress from 'material-ui/lib/circular-progress';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';

export default createClass({
    getInitialState() {
        return {
            nav: {},
            loading: true,
        };
    },

    componentWillMount() {
        const request = fetch('./sources/nav.json').then(reponse => reponse.json());

        Observable.fromPromise(request)
            .pluck('pages')
            .flatMap(pages => pages.map(page => page))
            .groupBy(page => page.module)
            .flatMap(values => values.toArray())
            .flatMap(module => {
                return [{ type: MenuItem.Types.SUBHEADER, text: module[0].module }].concat(module.map(page => {
                    return {
                        route: page.url,
                        text: page.name,
                    };
                }));
            })
            .reduce((collector, value) => collector.concat(value), [])
            .subscribe((navData) => {
                this.setState({
                    nav: navData,
                    loading: false,
                }, () => {
                    navigateTo(navData[1].route);
                });
            });
    },

    render() {
        if (this.state.loading) {
            return (
                <CircularProgress mode="indeterminate" />
            );
        }

        const appBarStyle = {
            position: 'fixed',
            marginBottom: '1rem',
        };

        return (
            <nav>
                <AppBar style={appBarStyle}
                        title="Documentation"
                        onLeftIconButtonTouchTap={this.toggleMenu}
                        iconElementRight={<IconButton className="material-icons"><FontIcon className="material-icons">code</FontIcon></IconButton>}
                    />
                <LeftNav ref="docsNav" menuItems={this.state.nav} onChange={this.navigate} docked={false} />
            </nav>
        );
    },

    navigate(event, itemIndex, menuItem) {
        navigateTo(menuItem.route);
    },

    toggleMenu() {
        this.refs.docsNav.toggle();
    },
});