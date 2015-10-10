import log from '../logger/Logger';

let jquery;

try {
    jquery = window.jQuery;
} catch (e) {
    log.getLogger().error('JQuery not found');
    jquery = {};
}

export default jquery;
