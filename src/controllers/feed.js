import {findAllGifs} from "../models/gifs";
import {findAllArticles} from "../models/articles"



exports.getFeed = (request, response) => {
	console.log(findAllGifs)
	const gifs = findAllGifs().then((feed)=> {
		console.log(feed)
		return feed 
	}).catch(error => error );
	const articles = findAllArticles().then(articles => articles).catch(error=>error);

	response.status(200).json({
		status: "success",
		data:  {gifs, articles}
		})

};

