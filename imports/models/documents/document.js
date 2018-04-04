import { Class } from 'meteor/jagi:astronomy';
import { Faculty } from "../users/faculty";
import { Student } from "../users/student";
import { Books } from "./book";
import { User } from "../users/user";

export const Copy = Class.create({
    name: 'Copy',
    fields: {
        reference: {
            type: Boolean
        },
        checked_out_date: {
            type: Date,
            optional: true
        },
        userID: {
            type: String,
            optional: true
        }
    }
});


export const Queue = Class.create({
    name: 'Queue',
    fields: {
        queue_of_students: {
            type: [String],
            default: [],

        },
        queue_of_other: {
            type: [String],
            default: [],
        },
    },
    helpers: {
        get_all_queue: function () {
            return this.queue_of_students.concat(this.queue_of_other);
        },
        inqueue: function (id) {
            let a = this.get_all_queue().indexOf(id);
            return !(a === -1);
        },
        get_queue: function (group) {
            if (group === "Student"){
                return this.queue_of_students;
            }
            else{
                return this.queue_of_other;
            }

        }
    },
});


export const Document = Class.create({
    name: 'Document',

    fields: {
        title: {
            type: String,
            validators: [{
                type: 'minLength',
                param: 1,
            }]
        },
        authorsID: {
            type: [String]
        },
        tags: {
            type: [String]
        },
        copies: {
            type: [Copy]
        },
        price: {
            type: Number
        },
        release_date: {                         // Release Date reserved as the Built_in Data type of "Date"
            type: Date,
            optional: true,
        },
        queue: {
            type: Queue,
            default: new Queue,
        },
    },

    helpers: {
        numberOfReferences: function () {
            return this.copies.filter(o => (o.reference)).length;
        },
        leftInLibrary: function () {
            return this.copies.filter(o => !(o.checked_out_date)).length;
        },
        available: function () {
            return this.copies.filter(o => !(o.checked_out_date || o.reference)).length;
        },
        numberOfCopies: function () {
            return this.copies.length;
        },
        tillDeadline: function (userID) {
            if (!this.userHas(userID)) throw new Error('user doesn\'t have the document');

            let copy = this.copies.find(o => o.checked_out_date && (o.userID === userID));

            let renterID = copy.userID;
            let duration;

            if (User.findOne({libraryID: renterID}).group === 'Faculty') {
                duration = 4*7;
            } else {
                duration = this.bestseller ? 2*7 : 3*7;
            }

            return Math.floor((copy.checked_out_date - new Date()) / 864e5) + duration;
        },
        calculateFee: function (userID) {
            let fee = this.tillDeadline(userID) * 100;
            return Math.max(0, Math.min(fee, this.price));
        },
        renters: function () {
            let renters = [];
            this.copies.forEach(o => {
                if (o.checked_out_date) {

                    let renter = User.findOne({libraryID: o.userID});

                    renters.push({name: renter.name, tillDeadline: this.tillDeadline(o.userID),libraryID:o.userID})
                }
            });
            return renters;
        },
        rentingViaId : function(cuser){
            let renters = [];
            this.copies.forEach(o => {
                if (o.checked_out_date) {

                    if ( cuser === o.userID) {
                        renters.push({tillDeadline: this.tillDeadline(o.userID)})
                    }
                }
            });
            return renters;
        },
        userHas(userID) {
            return this.copies.find(o => !o.reference && o.checked_out_date && (o.userID === userID));
        },
        canCheckOut(userID) {
            return !this.userHas(userID) && this.available()
        },
        checkOut(userID) {
            let copy = this.copies.find(o => !(o.checked_out_date || o.reference));
            if (copy) {
                copy.checked_out_date = new Date();
                copy.userID = userID;
                this.save();
                return true;
            } else
                return false;
        },
        return(userID) {
            let copy = this.userHas(userID);
            if (copy) {
                copy.checked_out_date = null;
                this.save();
            } else
                throw new Error( 'user '+ userID +' didnt have this book' );
        },

        addAuthor(author) {

        },
        addNewCopy(documentID) {

        },
        switchReference(documentID, boolean) {

        },
        getOverdueDocuments() {

        },
    },
});
