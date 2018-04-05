import React, { Component } from 'react';
import {Librarian} from "../../models/users/librarian"
import {User} from "../../models/users/user";

import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {BrowserRouter, Route, Link} from "react-router-dom"
import BOOKS from "./BOOKS";
import ARTICLES from "./ARTICLES";
import AaV from "./AaV";
import USERS from "./USERS";
import Home from "./App";





class Navigation extends Component{

    render(){
        if (this.props.currentUser){
            if (this.props.users.length===0){
                Meteor.call('addLibrarian', {id: this.props.currentUser._id, name: this.props.currentUser.username})
            }
            else if(!User.findOne({libraryID : this.props.currentUser._id})){
                Meteor.call('addHumbleUser', {id: this.props.currentUser._id, name: this.props.currentUser.username})
            }

        }

        let isLabrarian = this.props.currentUser &&
            Librarian.findOne({libraryID : this.props.currentUser._id}) &&
            Librarian.findOne({libraryID : this.props.currentUser._id}).group === "Librarian";
        return(

            <BrowserRouter>

                <div className="container">


                    <Route path="/" component={Home} />
                    <Route exact path="/books" component={BOOKS} />
                    <Route exact path="/articles" component={ARTICLES} />
                    <Route exact path="/av" component={AaV} />
                    <Route exact path="/users" component={USERS} />
                </div>
            </BrowserRouter>




        )

    }
}


export default withTracker(() => {
    return {
        users : User.find({}).fetch(),
        currentUser: Meteor.user(),
    };
})(Navigation);