import {findAllGifs} from "../models/gifs";
import {findAllArticles} from "../models/articles"



exports.getFeed = (request, response) => {
	const gifs = findAllGifs().then((gifs)=> {
		findAllArticles().then((articles)=>{
			response.status(200).json({
				status: "success",
				data:  {gifs, articles}
			})
		}).catch(error => {
			response.status(200).json({
				status: "error",
				data:  error
			})
		})
	}).catch(error => {
		response.status(200).json({
				status: "error",
				data:  error
			})
	});
	
	const articles = findAllArticles().then(articles => articles).catch(error=>error);

	console.log(gifs.then((gifs)=> gifs ).catch(error => error ))

	

};

