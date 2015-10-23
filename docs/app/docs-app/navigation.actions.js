import Action from 'd2-flux/action/Action';
import appStateStore from './appState.store';

const actions = Action.createActionsFromNames(['navigateTo']);

actions.navigateTo
    .subscribe((action) => {
        appStateStore.setState(action.data);
    });

export default actions;