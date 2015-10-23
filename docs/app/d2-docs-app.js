import {render} from 'react-dom';
import React from 'react';
import DocsApp from './docs-app/App';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

render(<DocsApp />, document.getElementById('docsApp'));