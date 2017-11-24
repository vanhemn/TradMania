module.exports = function(docpath, doc, path,callback){
        docpath = path.resolve(__dirname) + "/../public/docx/" + docpath;
        console.log(path.resolve(docpath));


        var mammoth = require("mammoth");
        var html2json = require('html2json').html2json;
        var json2html = require('html2json').json2html;


        
        mammoth.convertToHtml({path: path.resolve(docpath)}).then(function(result){
                console.log("tohtml");
        var html = result.value; // The generated HTML 
        var messages = result.messages; 
        var json = html2json(html);
        var result = [];
        // html ==> js avec indentation et balise
        for (var i in json.child){
                jsonready = new Object()
                jsonready.balise = json.child[i].tag;
                jsonready.text = []
                for (var y in json.child[i].child){
                        if (json.child[i].child[y].node == "text"){
                                jsonready.text[y] = json.child[i].child[y].text
                        } else {
                                jsonsub = new Object()
                                jsonsub.text = [];
                                jsonsub.balise = json.child[i].child[y].tag
                                if(json.child[i].child[y].child){
                                        for (var z in json.child[i].child[y].child){
                                                if (json.child[i].child[y].child[z].node == "text"){
                                                        jsonsub.text[z] = json.child[i].child[y].child[z].text
                                                } else {
                                                }
                                                jsonready.text[y] = jsonsub;
                                        }
                                }
                        }
                }
                result.push(jsonready);
        }
        doc.insertOne( { doc: docpath, "text" : result, "html" : html }, function(err, result){
                if(!err)
                        callback(result.insertedId)
        } )
}).done();



}