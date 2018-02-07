import React, { Component } from 'react';
import AccountsUIWrapper from './AccountsUIWrapper.js';

import Book from './Book.js';
import Article from './Article';
import {Librarian} from "../models/users/librarian"

import Users from "./User"
import {User} from "../models/users/user";

import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Books } from '../models/documents/book';
import { JournalArticle } from "../models/documents/journal_article";

import { Meteor } from 'meteor/meteor';
import AddBookButton from "../api/AddBookButton";
import AddArticleButton from "../api/AddArticleButton";
// App component - represents the whole app

class App extends Component {

    constructor() {
        super();
        this.case = null;
    }


    renderBooks() {
        if(Meteor.userId()) {


            return this.props.books.map((book) => (
                <Book key={book._id} book={book}/>
            ));
        }
    }

    renderArticles(){
        if(Meteor.userId()) {
            return this.props.articles.map((jarticle) => (
                <Article key={jarticle._id} jarticle={jarticle}/>
            ));
        }
    }

    renderUsers(){
        if(Meteor.userId()) {
            return this.props.users.map((user) => (
                <Users key={user._id} user={user}/>
            ));
        }
    }

    reanderCase(number){

        this.case ? this.case.style.display="none" : document.getElementById("books").style.display="none";

        switch (number) {

            case 1:
                document.getElementById("books").style.display="";
                this.case=document.getElementById("books");
                break;
            case 2:
                document.getElementById('articles').style.display="";
                this.case=document.getElementById("articles");
                break;
            case 3:
                document.getElementById('users').style.display="";
                this.case=document.getElementById("users");
                break;
            default:
                return("");
        }

    }






    render() {

        return <div className="container">

            <header>

                <div id={"lab"}>
                    <h1>InnoLibrary</h1>

                    <AccountsUIWrapper/>
                </div>

                <div id={"add"} align="center">
                    <AddBookButton/>
                    <AddArticleButton/>
                </div>


            </header>

                <div className="linebar">
                    <button onClick={this.reanderCase.bind(this,1)}>Books</button>
                    <button onClick={this.reanderCase.bind(this,2)}>Articles</button>
                    <button onClick={this.reanderCase.bind(this,3)}>Users</button>
                </div>

            <ul id="books" style={{display:""}}>
                {this.renderBooks()}
            </ul>

            <ul id="articles" style={{display:"none"}}>
                {this.renderArticles()}
            </ul>

            <ul id="users" style={{display:"none"}}>
                {this.renderUsers()}
            </ul>





        </div>;
    }
}

export default withTracker(() => {
    return {
        books: Books.find({}).fetch(),
        articles : JournalArticle.find({}).fetch(),
        users : Librarian.find({}).fetch(),
        currentUser: Meteor.user(),
    };
})(App);