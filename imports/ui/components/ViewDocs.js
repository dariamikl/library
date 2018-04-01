import React from 'react';
import Book from '../Book.js';
import Article from '../Article';
import {Librarian} from "../../models/users/librarian"
import Users from "../User"
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Users2 from "../User2";
import AV from "../AV";
export class ViewDocs extends React.Component {

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
    renderAV(){
        if(Meteor.userId()) {
            return this.props.avs.map((av) => (
                <AV key={av._id} av={av}/>
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
    renderUser2s(){
        if(Meteor.userId()) {
            return this.props.users.map((user) => (
                <Users2 key={user._id} user={user}/>
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
            case 4:
                document.getElementById('av').style.display="";
                this.case=document.getElementById("av");
                break;
            case 69:
                console.log("you are here");
                document.getElementById('users2').style.display="";
                this.case=document.getElementById("users2");
                break;
            default:
                return("");
        }

    }

    render() {

        // this.props.currentUser ? console.log( this.props.currentUser._id) : "";

        return  <div>
            <button onClick={this.reanderCase.bind(this,1)}>Books</button>
            <button onClick={this.reanderCase.bind(this,2)}>Articles</button>
            <button onClick={this.reanderCase.bind(this,4)}>AV</button>


            {
                this.props.currentUser ?
                    Librarian.findOne({libraryID : this.props.currentUser._id}) ?
                        Librarian.findOne({libraryID : this.props.currentUser._id}).group === "Librarian" ?
                            <button onClick={this.reanderCase.bind(this,3)}>Users</button>
                            : ''
                        :""
                    :""
            }
            {
                this.props.currentUser ?
                    Librarian.findOne({libraryID : this.props.currentUser._id}) ?
                        Librarian.findOne({libraryID : this.props.currentUser._id}).group === "Librarian" ?
                            <button onClick={this.reanderCase.bind(this,69)}>Users Stories</button>
                            : ''
                        :""
                    :""
            }
            <ul id="books" style={{display:""}}>
                {this.renderBooks()}
            </ul>
            <ul id="articles" style={{display:"none"}}>
                {this.renderArticles()}
            </ul>
            <ul id="av" style={{display:"none"}}>
                {this.renderAV()}
            </ul>

            <ul id="users" style={{display:"none"}}>
                {this.renderUsers()}
            </ul>
            <ul id="users2" style={{display:"none"}}>
                {this.renderUser2s()}
            </ul>
            </div>;
    }
}