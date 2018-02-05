import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../imports/models/documents/book';
import '../imports/models/documents/journal_article';
import App from '../imports/ui/App.js';
import {AddButton} from '../imports/api/AddBookButton'
import '../imports/startup/accounts-config.js';



Meteor.startup(() => {
    render(<App />, document.getElementById('render-target'));
    render(<AddButton />, document.getElementById('AddButton'))
});