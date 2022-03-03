require("./medium-claps.css");
var $ltq6t$rssparser = require("rss-parser");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "MediumClaps", () => $a96c34df1ac230bd$export$600f4672a55b18c4);


"use strict"; // Start of use strict
function $a96c34df1ac230bd$export$600f4672a55b18c4(config = {
    feedUrl: '',
    root: '#claps-container',
    template: '#post-template',
    missingImage: ''
}) {
    const configDefaults = {
        root: '#claps-container',
        template: '#post-template'
    };
    if (!config.root) config.root = configDefaults.root;
    if (!config.template) config.template = configDefaults.template;
    if (!config.feedUrl) throw 'Config incomplete. Please provide a feed URL.';
    if (!config.missingImage) throw 'Config incomplete. Please provide a missing image.';
    const placeholders = {
        postLink: '#{{postLink}}',
        postTitle: '#{{postTitle}}',
        authorName: '#{{postAuthor}}',
        postImage: '#{{postImage}}'
    };
    const createElementFromHTML = (htmlString)=>{
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    };
    const getFirstImageOfPostOrMissingImage = (html)=>{
        const regex = /<img.*?src="https:\/\/cdn-(.*?)"/;
        let matches = regex.exec(html);
        return matches ? "https://cdn-" + matches[1] : config.missingImage;
    };
    fetch(config.feedUrl).then((response)=>response.json()
    ).then((data)=>{
        return new ($parcel$interopDefault($ltq6t$rssparser))().parseString(data.contents);
    }).then((feed)=>{
        for (let item of feed.items){
            let imageUrl = getFirstImageOfPostOrMissingImage(item['content:encoded'] || item['content']);
            const post = {
                authorName: item.creator,
                postImage: imageUrl,
                postLink: item.link,
                postTitle: item.title
            };
            //replace all placeholders in template
            const newPost = document.querySelector(config.template).content.cloneNode(true).firstElementChild.outerHTML.replace(placeholders.postLink, post.postLink).replace(placeholders.postTitle, post.postTitle).replace(placeholders.authorName, post.authorName).replace(placeholders.postImage, post.postImage);
            //add the post to the root
            const el = createElementFromHTML(newPost);
            document.querySelector(config.root).appendChild(el);
            //use setTimeout to make sure the browser processes the new element
            //necessary to make transitions work properly
            window.setTimeout(()=>el.classList.add('is-visible')
            , 100);
        }
    }).catch(console.log);
}


//# sourceMappingURL=medium-claps.js.map
