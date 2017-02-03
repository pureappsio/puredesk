Template.userDetails.helpers({

    rating: function() {

        if (Ratings.findOne({ operatorId: this._id })) {
            // All ratings
            var ratings = Ratings.find({ operatorId: this._id }).fetch();

            var score = 0;
            for (i in ratings) {
                score += parseInt(ratings[i].score);
            }

            score = (score / ratings.length * 100).toFixed(0);

            return score + '%';
        } else {
            return 'Not rated yet';
        }


    }

})
