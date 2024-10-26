var aec_frontend = {atdlang : 'true',atd : 'true',expand : 'true',url : 'http://simoncoles.org/?aec_page=comment-popup.php',title : 'Comment Box'};var EXPORTED_SYMBOLS=['AtDCore'];function AtDCore(){this.ignore_types=['Bias Language','Cliches','Complex Expression','Diacritical Marks','Double Negatives','Hidden Verbs','Jargon Language','Passive voice','Phrases to Avoid','Redundant Expression'];this.ignore_strings={};this.i18n={};};AtDCore.prototype.getLang=function(key,defaultk){if(this.i18n[key]==undefined)
return defaultk;return this.i18n[key];};AtDCore.prototype.addI18n=function(localizations){this.i18n=localizations;};AtDCore.prototype.setIgnoreStrings=function(string){var parent=this;this.map(string.split(/,\s*/g),function(string){parent.ignore_strings[string]=1;});};AtDCore.prototype.showTypes=function(string){var show_types=string.split(/,\s*/g);var types={};types["Double Negatives"]=1;types["Hidden Verbs"]=1;types["Passive voice"]=1;types["Bias Language"]=1;types["Cliches"]=1;types["Complex Expression"]=1;types["Diacritical Marks"]=1;types["Jargon Language"]=1;types["Phrases to Avoid"]=1;types["Redundant Expression"]=1;var ignore_types=[];this.map(show_types,function(string){types[string]=undefined;});this.map(this.ignore_types,function(string){if(types[string]!=undefined)
ignore_types.push(string);});this.ignore_types=ignore_types;};AtDCore.prototype.makeError=function(error_s,tokens,type,seps,pre){var struct=new Object();struct.type=type;struct.string=error_s;struct.tokens=tokens;if(new RegExp("\\b"+error_s+"\\b").test(error_s)){struct.regexp=new RegExp("(?!"+error_s+"<)\\b"+error_s.replace(/\s+/g,seps)+"\\b");}
else if(new RegExp(error_s+"\\b").test(error_s)){struct.regexp=new RegExp("(?!"+error_s+"<)"+error_s.replace(/\s+/g,seps)+"\\b");}
else if(new RegExp("\\b"+error_s).test(error_s)){struct.regexp=new RegExp("(?!"+error_s+"<)\\b"+error_s.replace(/\s+/g,seps));}
else{struct.regexp=new RegExp("(?!"+error_s+"<)"+error_s.replace(/\s+/g,seps));}
struct.used=false;return struct;};AtDCore.prototype.addToErrorStructure=function(errors,list,type,seps){var parent=this;this.map(list,function(error){var tokens=error["word"].split(/\s+/);var pre=error["pre"];var first=tokens[0];if(errors['__'+first]==undefined){errors['__'+first]=new Object();errors['__'+first].pretoks={};errors['__'+first].defaults=new Array();}
if(pre==""){errors['__'+first].defaults.push(parent.makeError(error["word"],tokens,type,seps,pre));}else{if(errors['__'+first].pretoks['__'+pre]==undefined)
errors['__'+first].pretoks['__'+pre]=new Array();errors['__'+first].pretoks['__'+pre].push(parent.makeError(error["word"],tokens,type,seps,pre));}});};AtDCore.prototype.buildErrorStructure=function(spellingList,enrichmentList,grammarList){var seps=this._getSeparators();var errors={};this.addToErrorStructure(errors,spellingList,"hiddenSpellError",seps);this.addToErrorStructure(errors,grammarList,"hiddenGrammarError",seps);this.addToErrorStructure(errors,enrichmentList,"hiddenSuggestion",seps);return errors;};AtDCore.prototype._getSeparators=function(){var re='',i;var str='"s!#$%&()*+,./:;<=>?@[\]^_{|}';for(i=0;i<str.length;i++)
re+='\\'+str.charAt(i);return"(?:(?:[\xa0"+re+"])|(?:\\-\\-))+";};AtDCore.prototype.processXML=function(responseXML){var types={};this.map(this.ignore_types,function(type){types[type]=1;});this.suggestions=[];var errors=responseXML.getElementsByTagName('error');var grammarErrors=[];var spellingErrors=[];var enrichment=[];for(var i=0;i<errors.length;i++){if(errors[i].getElementsByTagName('string').item(0).firstChild!=null){var errorString=errors[i].getElementsByTagName('string').item(0).firstChild.data;var errorType=errors[i].getElementsByTagName('type').item(0).firstChild.data;var errorDescription=errors[i].getElementsByTagName('description').item(0).firstChild.data;var errorContext;if(errors[i].getElementsByTagName('precontext').item(0).firstChild!=null)
errorContext=errors[i].getElementsByTagName('precontext').item(0).firstChild.data;else
errorContext="";if(this.ignore_strings[errorString]==undefined){var suggestion={};suggestion["description"]=errorDescription;suggestion["suggestions"]=[];suggestion["matcher"]=new RegExp('^'+errorString.replace(/\s+/,this._getSeparators())+'$');suggestion["context"]=errorContext;suggestion["string"]=errorString;suggestion["type"]=errorType;this.suggestions.push(suggestion);if(errors[i].getElementsByTagName('suggestions').item(0)!=undefined){var suggestions=errors[i].getElementsByTagName('suggestions').item(0).getElementsByTagName('option');for(var j=0;j<suggestions.length;j++)
suggestion["suggestions"].push(suggestions[j].firstChild.data);}
if(errors[i].getElementsByTagName('url').item(0)!=undefined){var errorUrl=errors[i].getElementsByTagName('url').item(0).firstChild.data;suggestion["moreinfo"]=errorUrl+'&theme=tinymce';}
if(types[errorDescription]==undefined){if(errorType=="suggestion")
enrichment.push({word:errorString,pre:errorContext});if(errorType=="grammar")
grammarErrors.push({word:errorString,pre:errorContext});}
if(errorType=="spelling"||errorDescription=="Homophone")
spellingErrors.push({word:errorString,pre:errorContext});if(errorDescription=='Cliches')
suggestion["description"]='Clich&eacute;s';if(errorDescription=="Spelling")
suggestion["description"]=this.getLang('menu_title_spelling','Spelling');if(errorDescription=="Repeated Word")
suggestion["description"]=this.getLang('menu_title_repeated_word','Repeated Word');if(errorDescription=="Did you mean...")
suggestion["description"]=this.getLang('menu_title_confused_word','Did you mean...');}}}
var errorStruct;var ecount=spellingErrors.length+grammarErrors.length+enrichment.length;if(ecount>0)
errorStruct=this.buildErrorStructure(spellingErrors,enrichment,grammarErrors);else
errorStruct=undefined;return{errors:errorStruct,count:ecount,suggestions:this.suggestions};};AtDCore.prototype.findSuggestion=function(element){var text=element.innerHTML;var context=(this.getAttrib(element,'pre')+"").replace(/[\\,!\\?\\."\s]/g,'');if(this.getAttrib(element,'pre')==undefined)
{alert(element.innerHTML);}
var errorDescription=undefined;var len=this.suggestions.length;for(var i=0;i<len;i++){var key=this.suggestions[i]["string"];if((context==""||context==this.suggestions[i]["context"])&&this.suggestions[i]["matcher"].test(text)){errorDescription=this.suggestions[i];break;}}
return errorDescription;};function TokenIterator(tokens){this.tokens=tokens;this.index=0;this.count=0;this.last=0;};TokenIterator.prototype.next=function(){var current=this.tokens[this.index];this.count=this.last;this.last+=current.length+1;this.index++;if(current!=""){if(current[0]=="'")
current=current.substring(1,current.length);if(current[current.length-1]=="'")
current=current.substring(0,current.length-1);}
return current;};TokenIterator.prototype.hasNext=function(){return this.index<this.tokens.length;};TokenIterator.prototype.hasNextN=function(n){return(this.index+n)<this.tokens.length;};TokenIterator.prototype.skip=function(m,n){this.index+=m;this.last+=n;if(this.index<this.tokens.length)
this.count=this.last-this.tokens[this.index].length;};TokenIterator.prototype.getCount=function(){return this.count;};TokenIterator.prototype.peek=function(n){var peepers=new Array();var end=this.index+n;for(var x=this.index;x<end;x++)
peepers.push(this.tokens[x]);return peepers;};AtDCore.prototype.markMyWords=function(container_nodes,errors){var seps=new RegExp(this._getSeparators());var nl=new Array();var ecount=0;var parent=this;this._walk(container_nodes,function(n){if(n.nodeType==3&&!parent.isMarkedNode(n))
nl.push(n);});var iterator;this.map(nl,function(n){var v;if(n.nodeType==3){v=n.nodeValue;var tokens=n.nodeValue.split(seps);var previous="";var doReplaces=[];iterator=new TokenIterator(tokens);while(iterator.hasNext()){var token=iterator.next();var current=errors['__'+token];var defaults;if(current!=undefined&&current.pretoks!=undefined){defaults=current.defaults;current=current.pretoks['__'+previous];var done=false;var prev,curr;prev=v.substr(0,iterator.getCount());curr=v.substr(prev.length,v.length);var checkErrors=function(error){if(error!=undefined&&!error.used&&foundStrings['__'+error.string]==undefined&&error.regexp.test(curr)){var oldlen=curr.length;foundStrings['__'+error.string]=1;doReplaces.push([error.regexp,'<span class="'+error.type+'" pre="'+previous+'">$&</span>']);error.used=true;done=true;}};var foundStrings={};if(current!=undefined){previous=previous+' ';parent.map(current,checkErrors);}
if(!done){previous='';parent.map(defaults,checkErrors);}}
previous=token;}
if(doReplaces.length>0){newNode=n;for(var x=0;x<doReplaces.length;x++){var regexp=doReplaces[x][0],result=doReplaces[x][1];var bringTheHurt=function(node){if(node.nodeType==3){ecount++;if(parent.isIE()&&node.nodeValue.length>0&&node.nodeValue.substr(0,1)==' ')
return parent.create('<span class="mceItemHidden">&nbsp;</span>'+node.nodeValue.substr(1,node.nodeValue.length-1).replace(regexp,result),false);else
return parent.create(node.nodeValue.replace(regexp,result),false);}
else{var contents=parent.contents(node);for(var y=0;y<contents.length;y++){if(contents[y].nodeType==3&&regexp.test(contents[y].nodeValue)){var nnode;if(parent.isIE()&&contents[y].nodeValue.length>0&&contents[y].nodeValue.substr(0,1)==' ')
nnode=parent.create('<span class="mceItemHidden">&nbsp;</span>'+contents[y].nodeValue.substr(1,contents[y].nodeValue.length-1).replace(regexp,result),true);else
nnode=parent.create(contents[y].nodeValue.replace(regexp,result),true);parent.replaceWith(contents[y],nnode);parent.removeParent(nnode);ecount++;return node;}}
return node;}};newNode=bringTheHurt(newNode);}
parent.replaceWith(n,newNode);}}});return ecount;};AtDCore.prototype._walk=function(elements,f){var i;for(i=0;i<elements.length;i++){f.call(f,elements[i]);this._walk(this.contents(elements[i]),f);}};AtDCore.prototype.removeWords=function(node,w){var count=0;var parent=this;this.map(this.findSpans(node).reverse(),function(n){if(n&&(parent.isMarkedNode(n)||parent.hasClass(n,'mceItemHidden')||parent.isEmptySpan(n))){if(n.innerHTML=='&nbsp;'){var nnode=document.createTextNode(' ');parent.replaceWith(n,nnode);}
else if(!w||n.innerHTML==w){parent.removeParent(n);count++;}}});return count;};AtDCore.prototype.isEmptySpan=function(node){return(this.getAttrib(node,'class')==""&&this.getAttrib(node,'style')==""&&this.getAttrib(node,'id')==""&&!this.hasClass(node,'Apple-style-span')&&this.getAttrib(node,'mce_name')=="");};AtDCore.prototype.isMarkedNode=function(node){return(this.hasClass(node,'hiddenGrammarError')||this.hasClass(node,'hiddenSpellError')||this.hasClass(node,'hiddenSuggestion'));};AtDCore.prototype.applySuggestion=function(element,suggestion){if(suggestion=='(omit)'){this.remove(element);}
else{var node=this.create(suggestion);this.replaceWith(element,node);this.removeParent(node);}};AtDCore.prototype.hasErrorMessage=function(xmlr){return(xmlr!=undefined&&xmlr.getElementsByTagName('message').item(0)!=null);};AtDCore.prototype.getErrorMessage=function(xmlr){return xmlr.getElementsByTagName('message').item(0);};AtDCore.prototype.isIE=function(){return navigator.appName=='Microsoft Internet Explorer';};var AtD={rpc:'',rpc_css:'http://www.polishmywriting.com/atd-jquery/server/proxycss.php?data=',rpc_css_lang:'en',api_key:'',i18n:{},listener:{}};AtD.getLang=function(key,defaultk){if(AtD.i18n[key]==undefined)
return defaultk;return AtD.i18n[key];};AtD.addI18n=function(localizations){AtD.i18n=localizations;AtD.core.addI18n(localizations);};AtD.setIgnoreStrings=function(string){AtD.core.setIgnoreStrings(string);};AtD.showTypes=function(string){AtD.core.showTypes(string);};AtD.checkCrossAJAX=function(container_id,callback_f){if(typeof AtD_proofread_click_count!="undefined")
AtD_proofread_click_count++;AtD.callback_f=callback_f;AtD.remove(container_id);var container=jQuery('#'+container_id);var html=container.html();text=jQuery.trim(container.html());text=encodeURIComponent(text.replace(/\%/g,'%25'));if((text.length>2000&&navigator.appName=='Microsoft Internet Explorer')||text.length>7800){if(callback_f!=undefined&&callback_f.error!=undefined)
callback_f.error("Maximum text length for this browser exceeded");return;}
CSSHttpRequest.get(AtD.rpc_css+text+"&lang="+AtD.rpc_css_lang+"&nocache="+(new Date().getTime()),function(response){var xml;if(navigator.appName=='Microsoft Internet Explorer'){xml=new ActiveXObject("Microsoft.XMLDOM");xml.async=false;xml.loadXML(response);}
else{xml=(new DOMParser()).parseFromString(response,'text/xml');}
if(AtD.core.hasErrorMessage(xml)){if(AtD.callback_f!=undefined&&AtD.callback_f.error!=undefined)
AtD.callback_f.error(AtD.core.getErrorMessage(xml));return;}
AtD.container=container_id;var count=AtD.processXML(container_id,xml);if(AtD.callback_f!=undefined&&AtD.callback_f.ready!=undefined)
AtD.callback_f.ready(count);if(count==0&&AtD.callback_f!=undefined&&AtD.callback_f.success!=undefined)
AtD.callback_f.success(count);AtD.counter=count;AtD.count=count;});};AtD.check=function(container_id,callback_f){if(typeof AtD_proofread_click_count!="undefined")
AtD_proofread_click_count++;AtD.callback_f=callback_f;AtD.remove(container_id);var container=jQuery('#'+container_id);var html=container.html();text=jQuery.trim(container.html());text=encodeURIComponent(text);jQuery.ajax({type:"POST",url:AtD.rpc+'/checkDocument',data:'key='+AtD.api_key+'&data='+text,format:'raw',dataType:(jQuery.browser.msie)?"text":"xml",error:function(XHR,status,error){if(AtD.callback_f!=undefined&&AtD.callback_f.error!=undefined)
AtD.callback_f.error(status+": "+error);},success:function(data){var xml;if(typeof data=="string"){xml=new ActiveXObject("Microsoft.XMLDOM");xml.async=false;xml.loadXML(data);}
else{xml=data;}
if(AtD.core.hasErrorMessage(xml)){if(AtD.callback_f!=undefined&&AtD.callback_f.error!=undefined)
AtD.callback_f.error(AtD.core.getErrorMessage(xml));return;}
AtD.container=container_id;var count=AtD.processXML(container_id,xml);if(AtD.callback_f!=undefined&&AtD.callback_f.ready!=undefined)
AtD.callback_f.ready(count);if(count==0&&AtD.callback_f!=undefined&&AtD.callback_f.success!=undefined)
AtD.callback_f.success(count);AtD.counter=count;AtD.count=count;}});};AtD.remove=function(container_id){AtD._removeWords(container_id,null);};AtD.clickListener=function(event){if(AtD.core.isMarkedNode(event.target))
AtD.suggest(event.target);};AtD.processXML=function(container_id,responseXML){var results=AtD.core.processXML(responseXML);if(results.count>0)
results.count=AtD.core.markMyWords(jQuery('#'+container_id).contents(),results.errors);jQuery('#'+container_id).unbind('click',AtD.clickListener);jQuery('#'+container_id).click(AtD.clickListener);return results.count;};AtD.useSuggestion=function(word){this.core.applySuggestion(AtD.errorElement,word);AtD.counter--;if(AtD.counter==0&&AtD.callback_f!=undefined&&AtD.callback_f.success!=undefined)
AtD.callback_f.success(AtD.count);};AtD.editSelection=function(){var parent=AtD.errorElement.parent();if(AtD.callback_f!=undefined&&AtD.callback_f.editSelection!=undefined)
AtD.callback_f.editSelection(AtD.errorElement);if(AtD.errorElement.parent()!=parent){AtD.counter--;if(AtD.counter==0&&AtD.callback_f!=undefined&&AtD.callback_f.success!=undefined)
AtD.callback_f.success(AtD.count);}};AtD.ignoreSuggestion=function(){AtD.core.removeParent(AtD.errorElement);AtD.counter--;if(AtD.counter==0&&AtD.callback_f!=undefined&&AtD.callback_f.success!=undefined)
AtD.callback_f.success(AtD.count);};AtD.ignoreAll=function(container_id){var target=AtD.errorElement.text();var removed=AtD._removeWords(container_id,target);AtD.counter-=removed;if(AtD.counter==0&&AtD.callback_f!=undefined&&AtD.callback_f.success!=undefined)
AtD.callback_f.success(AtD.count);if(AtD.callback_f!=undefined&&AtD.callback_f.ignore!=undefined){AtD.callback_f.ignore(target);AtD.core.setIgnoreStrings(target);}};AtD.explainError=function(){if(AtD.callback_f!=undefined&&AtD.callback_f.explain!=undefined)
AtD.callback_f.explain(AtD.explainURL);};AtD.suggest=function(element){if(jQuery('#suggestmenu').length==0){var suggest=jQuery('<div id="suggestmenu"></div>');suggest.prependTo('body');}
else{var suggest=jQuery('#suggestmenu');suggest.hide();}
errorDescription=AtD.core.findSuggestion(element);AtD.errorElement=jQuery(element);suggest.empty();if(errorDescription==undefined){suggest.append('<strong>'+AtD.getLang('menu_title_no_suggestions','No suggestions')+'</strong>');}
else if(errorDescription["suggestions"].length==0){suggest.append('<strong>'+errorDescription['description']+'</strong>');}
else{suggest.append('<strong>'+errorDescription['description']+'</strong>');for(var i=0;i<errorDescription["suggestions"].length;i++){(function(sugg){suggest.append('<a href="javascript:AtD.useSuggestion(\''+sugg.replace(/'/,'\\\'')+'\')">'+sugg+'</a>');})(errorDescription["suggestions"][i]);}}
if(AtD.callback_f!=undefined&&AtD.callback_f.explain!=undefined&&errorDescription['moreinfo']!=undefined){suggest.append('<a href="javascript:AtD.explainError()" class="spell_sep_top">'+AtD.getLang('menu_option_explain','Explain...')+'</a>');AtD.explainURL=errorDescription['moreinfo'];}
suggest.append('<a href="javascript:AtD.ignoreSuggestion()" class="spell_sep_top">'+AtD.getLang('menu_option_ignore_once','Ignore suggestion')+'</a>');if(AtD.callback_f!=undefined&&AtD.callback_f.editSelection!=undefined){if(AtD.callback_f!=undefined&&AtD.callback_f.ignore!=undefined)
suggest.append('<a href="javascript:AtD.ignoreAll(\''+AtD.container+'\')">'+AtD.getLang('menu_option_ignore_always','Ignore always')+'</a>');else
suggest.append('<a href="javascript:AtD.ignoreAll(\''+AtD.container+'\')">'+AtD.getLang('menu_option_ignore_all','Ignore all')+'</a>');suggest.append('<a href="javascript:AtD.editSelection(\''+AtD.container+'\')" class="spell_sep_bottom spell_sep_top">'+AtD.getLang('menu_option_edit_selection','Edit Selection...')+'</a>');}
else{if(AtD.callback_f!=undefined&&AtD.callback_f.ignore!=undefined)
suggest.append('<a href="javascript:AtD.ignoreAll(\''+AtD.container+'\')" class="spell_sep_bottom">'+AtD.getLang('menu_option_ignore_always','Ignore always')+'</a>');else
suggest.append('<a href="javascript:AtD.ignoreAll(\''+AtD.container+'\')" class="spell_sep_bottom">'+AtD.getLang('menu_option_ignore_all','Ignore all')+'</a>');}
var pos=jQuery(element).offset();var width=jQuery(element).width();jQuery(suggest).css({left:(pos.left+width)+'px',top:pos.top+'px'});jQuery(suggest).fadeIn(200);AtD.suggestShow=true;setTimeout(function(){jQuery("body").bind("click",function(){if(!AtD.suggestShow)
jQuery('#suggestmenu').fadeOut(200);});},1);setTimeout(function(){AtD.suggestShow=false;},2);};AtD._removeWords=function(container_id,w){return this.core.removeWords(jQuery('#'+container_id),w);};AtD.initCoreModule=function(){var core=new AtDCore();core.hasClass=function(node,className){return jQuery(node).hasClass(className);};core.map=jQuery.map;core.contents=function(node){return jQuery(node).contents();};core.replaceWith=function(old_node,new_node){return jQuery(old_node).replaceWith(new_node);};core.findSpans=function(parent){return jQuery.makeArray(parent.find('span'));};core.create=function(node_html,isTextNode){return jQuery('<span class="mceItemHidden">'+node_html+'</span>');};core.remove=function(node){return jQuery(node).remove();};core.removeParent=function(node){if(jQuery(node).unwrap)
return jQuery(node).contents().unwrap();else
return jQuery(node).replaceWith(jQuery(node).html());};core.getAttrib=function(node,name){return jQuery(node).attr(name);};return core;};AtD.core=AtD.initCoreModule();AtD.textareas={};AtD.restoreTextArea=function(id){var options=AtD.textareas[id];if(options==undefined||options['before']==options['link'].html())
return;AtD.remove(id);jQuery('#AtD_sync_').remove();var content;if(navigator.appName=='Microsoft Internet Explorer')
content=jQuery('#'+id).html().replace(/<BR.*?class.*?atd_remove_me.*?>/gi,"\n");else
content=jQuery('#'+id).html();jQuery('#'+id).replaceWith(options['node']);jQuery('#'+id).val(content.replace(/\&lt\;/g,'<').replace(/\&gt\;/,'>').replace(/\&amp;/g,'&'));jQuery('#'+id).height(options['height']);options['link'].html(options['before']);};AtD.checkTextAreaCrossAJAX=function(id,linkId,after){AtD._checkTextArea(id,AtD.checkCrossAJAX,linkId,after);}
AtD.checkTextArea=function(id,linkId,after){if(AtD.api_key==undefined||AtD.rpc==undefined)
alert("You need to set AtD.api_key and AtD.rpc to use AtD.checkTextArea()");else
AtD._checkTextArea(id,AtD.check,linkId,after);}
AtD._checkTextArea=function(id,commChannel,linkId,after){var container=jQuery('#'+id);if(AtD.textareas[id]==undefined){var properties={};var saveProperty=function(key,node){if(node.css(key)!="")
properties[key]=node.css(key);}
var saveme=['background-color','color','font-size','font-family','border-top-width','border-bottom-width','border-left-width','border-right-width','border-top-style','border-bottom-style','border-left-style','border-right-style','border-top-color','border-bottom-color','border-left-color','border-right-color','text-align','margin-top','margin-bottom','margin-left','margin-right','width','line-height','letter-spacing','left','right','top','bottom','position','padding-left','padding-right','padding-top','padding-bottom'];for(var x=0,node=container;x<saveme.length;x++){saveProperty(saveme[x],node);}
AtD.textareas[id]={'node':container,'height':container.height(),'link':jQuery('#'+linkId),'before':jQuery('#'+linkId).html(),'after':after,'style':properties};}
var options=AtD.textareas[id];if(options['link'].html()!=options['before']){AtD.restoreTextArea(id);}
else{options['link'].html(options['after']);var disableClick=function(){return false;};options['link'].click(disableClick);var div;var hidden=jQuery('<input type="hidden" />');hidden.attr('id','AtD_sync_');hidden.val(container.val());var name=container.attr('name');if(navigator.appName=='Microsoft Internet Explorer'){container.replaceWith('<div id="'+id+'">'+container.val().replace(/\&/g,'&amp;').replace(/[\n\r\f]/gm,'<BR class="atd_remove_me">')+'</div>');div=jQuery('#'+id);div.attr('style',options['node'].attr('style'));div.attr('class',options['node'].attr('class'));div.css({'overflow':'auto'});options['style']['font-size']=undefined;options['style']['font-family']=undefined;}
else{container.replaceWith('<div id="'+id+'">'+container.val().replace(/\&/g,'&amp;')+'</div>');div=jQuery('#'+id);div.attr('style',options['node'].attr('style'));div.attr('class',options['node'].attr('class'));div.css({'overflow':'auto','white-space':'pre-wrap'});div.attr('contenteditable','true');div.attr('spellcheck',false);div.css({'outline':'none'});}
div.keypress(function(event){return event.keyCode!=13;});hidden.attr('name',name);div.after(hidden);var inProgress=false;var syncContents=function(){if(inProgress)
return;inProgress=true;setTimeout(function(){var content;if(navigator.appName=='Microsoft Internet Explorer')
content=div.html().replace(/<BR.*?class.*?atd_remove_me.*?>/gi,"\n");else
content=div.html();var temp=jQuery('<div></div>');temp.html(content);AtD.core.removeWords(temp);hidden.val(temp.html().replace(/\&lt\;/g,'<').replace(/\&gt\;/,'>').replace(/\&amp;/g,'&'));inProgress=false;},1500);};div.keypress(syncContents);div.mousemove(syncContents);div.mouseout(syncContents);div.css(options['style']);div.height(options['height']);commChannel(id,{ready:function(errorCount){options['link'].unbind('click',disableClick);},explain:function(url){var left=(screen.width/2)-(480/2);var top=(screen.height/2)-(380/2);window.open(url,'','width=480,height=380,toolbar=0,status=0,resizable=0,location=0,menuBar=0,left='+left+',top='+top).focus();},success:function(errorCount){if(errorCount==0)
alert(AtD.getLang('message_no_errors_found',"No writing errors were found"));AtD.restoreTextArea(id);},error:function(reason){options['link'].unbind('click',disableClick);if(reason==undefined)
alert(AtD.getLang('message_server_error_short',"There was an error communicating with the spell checking service."));else
alert(AtD.getLang('message_server_error_short',"There was an error communicating with the spell checking service.")+"\n\n"+reason);AtD.restoreTextArea(id);},editSelection:function(element){var text=prompt(AtD.getLang('dialog_replace_selection',"Replace selection with:"),element.text());if(text!=null){jQuery(element).html(text);AtD.core.removeParent(element);}}});}}
jQuery.fn.addProofreader=function(options){this.id=0;var parent=this;var opts=jQuery.extend({},jQuery.fn.addProofreader.defaults,options);return this.each(function(){$this=jQuery(this);if($this.css('display')=='none')
return;if($this.attr('id').length==0){$this.attr('id','AtD_'+parent.id++);}
var id=$this.attr('id');var node=jQuery('<span></span>');node.attr('id','AtD_'+parent.id++);node.html(opts.proofread_content);node.click(function(event){if(AtD.current_id!=undefined&&AtD.current_id!=id){AtD.restoreTextArea(AtD.current_id);}
if(AtD.api_key!=""&&AtD.rpc!=""){AtD.checkTextArea(id,node.attr('id'),opts.edit_text_content);}
else{AtD.checkTextAreaCrossAJAX(id,node.attr('id'),opts.edit_text_content);}
AtD.current_id=id;});$this.wrap('<div></div>');$this.parents('form').submit(function(event){AtD.restoreTextArea(id);});$this.before(node);});};jQuery.fn.addProofreader.defaults={edit_text_content:'<span class="AtD_edit_button"></span>',proofread_content:'<span class="AtD_proofread_button"></span>'};
(function(){var chr=window.CSSHttpRequest={};chr.id=0;chr.requests={};chr.MATCH_ORDINAL=/#c(\d+)/;chr.MATCH_URL=/url\("?data\:[^,]*,([^")]+)"?\)/;chr.get=function(url,callback){var id=++chr.id;var iframe=document.createElement("iframe");iframe.style.position="absolute";iframe.style.left=iframe.style.top="-1000px";iframe.style.width=iframe.style.height=0;document.documentElement.appendChild(iframe);var r=chr.requests[id]={id:id,iframe:iframe,document:iframe.contentDocument||iframe.contentWindow.document,callback:callback};r.document.open("text/html",false);r.document.write("<html><head>");r.document.write("<link rel='stylesheet' type='text/css' media='print, csshttprequest' href='"+chr.escapeHTML(url)+"' />");r.document.write("</head><body>");r.document.write("<script type='text/javascript'>");r.document.write("(function(){var w = window; var p = w.parent; p.CSSHttpRequest.sandbox(w); w.onload = function(){p.CSSHttpRequest.callback('"+id+"');};})();");r.document.write("</script>");r.document.write("</body></html>");r.document.close();};chr.sandbox=function(w){};chr.callback=function(id){var r=chr.requests[id];var data=chr.parse(r);r.callback(data);window.setTimeout(function(){var r=chr.requests[id];try{r.iframe.parentElement.removeChild(r.iframe);}catch(e){};delete chr.requests[id];},0);};chr.parse=function(r){var data=[];try{var rules=r.document.styleSheets[0].cssRules||r.document.styleSheets[0].rules;for(var i=0;i<rules.length;i++){try{var r=rules.item?rules.item(i):rules[i];var ord=r.selectorText.match(chr.MATCH_ORDINAL)[1];var val=r.style.backgroundImage.match(chr.MATCH_URL)[1];data[ord]=val;}catch(e){}}}
catch(e){r.document.getElementsByTagName("link")[0].setAttribute("media","screen");var x=r.document.createElement("div");x.innerHTML="foo";r.document.body.appendChild(x);var ord=0;try{while(1){x.id="c"+ord;var style=r.document.defaultView.getComputedStyle(x,null);var bg=style["background-image"]||style.backgroundImage||style.getPropertyValue("background-image");var val=bg.match(chr.MATCH_URL)[1];data[ord]=val;ord++;}}catch(e){}}
return decodeURIComponent(data.join(""));};chr.escapeHTML=function(s){return s.replace(/([<>&""''])/g,function(m,c){switch(c){case"<":return"&lt;";case">":return"&gt;";case"&":return"&amp;";case'"':return"&quot;";case"'":return"&apos;";}
return c;});};})();jQuery(document).ready(function() {
	//After the deadline
	$j = jQuery;
	$j('textarea#comment').before("<div id='aec_edit_options'></div>");
	if (aec_frontend.atd == 'true') {
		AtD.rpc_css_lang = aec_frontend.atdlang;
		$j('textarea#comment').addProofreader();
		$j("#submit").click(function() {  
				$j(".AtD_edit_button").trigger("click");
		});
		var spellcheck = $j("#AtD_0").clone(true);
		$j("#AtD_0").remove();
		$j("#aec_edit_options").append(spellcheck);
	}
	if (aec_frontend.expand == 'true') {
		//Don't show this option on a mobile device
		try {
			var uagent = navigator.userAgent.toLowerCase();
			if (uagent.search('iphone') > -1) { return true; }
			if (uagent.search('ipod') > -1) { return true; }
			if (uagent.search('webkit') > -1) { 
				if (uagent.search('series60') > -1) { 
					if (uagent.search('symbian') > -1) { return true; } 
				}
			}
			if (uagent.search('android') > -1) { return true; }
			if (uagent.search('windows ce') > -1) { return true; }
			if (uagent.search('blackberry') > -1) { return true; }
			if (uagent.search('palm') > -1) { return true; }
		} catch(err) { }
		//AEC Expand Comment Option
		$j("#aec_edit_options").append("<span class='aec_expand'></span>");
		$j(".aec_expand").colorbox({title: aec_frontend.title,iframe: true,href: aec_frontend.url, width:"90%", height:"90%", opacity: 0.6, onOpen: function() {$j(".AtD_edit_button").trigger("click");}});
	}
});