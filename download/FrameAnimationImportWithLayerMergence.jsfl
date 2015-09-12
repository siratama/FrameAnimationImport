(function ($hx_exports) { "use strict";
var AssetsImport = function(document,frameAnimationExportFolerURI,directoryStructure) {
	this.document = document;
	this.library = document.library;
	this.frameAnimationExportFolerURI = frameAnimationExportFolerURI;
	this.directoryStructure = directoryStructure;
	this.assetsDirectoryPath = [frameAnimationExportFolerURI,"assets"].join("/");
};
AssetsImport.__name__ = true;
AssetsImport.prototype = {
	execute: function() {
		this.roop(this.directoryStructure,"");
	}
	,roop: function(directory,parentRelativeDirectoryPath) {
		var relativeDirectoryPath;
		if(directory.name == "") relativeDirectoryPath = parentRelativeDirectoryPath; else relativeDirectoryPath = [parentRelativeDirectoryPath,directory.name].join("/");
		var directoryPath = this.assetsDirectoryPath + relativeDirectoryPath;
		var folderPath = [(ImportFolder.instance == null?ImportFolder.instance = new ImportFolder():ImportFolder.instance).name,"assets"].join("/") + relativeDirectoryPath;
		var bitmapFolderPath = [folderPath,"_bitmap"].join("/");
		this.createFolder(folderPath);
		this.createFolder(bitmapFolderPath);
		this.createSymbols(directory,directoryPath,folderPath,bitmapFolderPath);
		var _g = 0;
		var _g1 = directory.directories;
		while(_g < _g1.length) {
			var childDirectory = _g1[_g];
			++_g;
			this.roop(childDirectory,relativeDirectoryPath);
		}
	}
	,createFolder: function(path) {
		if(!this.library.itemExists(path)) this.library.newFolder(path);
	}
	,createSymbols: function(directory,directoryPath,folderPath,bitmapFolderPath) {
		var _g = 0;
		var _g1 = directory.files;
		while(_g < _g1.length) {
			var file = _g1[_g];
			++_g;
			var fileName = file + ".png";
			var imageFilePath = [directoryPath,fileName].join("/");
			this.document.importFile(imageFilePath,true,false);
			var symbolName = [folderPath,file].join("/");
			this.library.addNewItem(jsfl.ItemType.GRAPHIC,symbolName);
			this.library.editItem();
			this.library.addItemToDocument({ x : 0, y : 0},fileName);
			var element = this.document.getTimeline().layers[0].frames[0].elements[0];
			element.x = 0;
			element.y = 0;
			this.library.selectItem(fileName);
			this.library.moveToFolder(bitmapFolderPath);
		}
	}
};
var FrameAnimationImport = $hx_exports.FrameAnimationImport = function(layerMergence) {
	if(jsfl.Lib.fl.getDocumentDOM() == null) return;
	jsfl.Lib.fl.trace("--- FrameAnimationImport ---");
	var frameAnimationExportFolerURI = jsfl.Lib.fl.browseForFolderURL("Select " + "frame_animation_export" + ".");
	if(frameAnimationExportFolerURI == null) return;
	var information = JsonReader.getInformation(frameAnimationExportFolerURI);
	if(information == null) {
		jsfl.Lib.fl.trace("not found: " + [frameAnimationExportFolerURI,"json","info" + ".json"].join("/") + "}}");
		return;
	}
	var directoryStructure = JsonReader.getDirectoryStruture(frameAnimationExportFolerURI);
	var document = jsfl.Lib.fl.getDocumentDOM();
	(ImportFolder.instance == null?ImportFolder.instance = new ImportFolder():ImportFolder.instance).initialize(document.library,information.filename);
	var assetsImport = new AssetsImport(document,frameAnimationExportFolerURI,directoryStructure);
	assetsImport.execute();
	var layerStructure = JsonReader.getLayerStructure(frameAnimationExportFolerURI);
	var layerIndex = JsonReader.getLayerIndex(frameAnimationExportFolerURI);
	var movieClipCreation = new MovieClipCreation(document,layerStructure,layerIndex);
	movieClipCreation.execute();
	if(layerMergence) LayerMargence.execute(document);
	jsfl.Lib.fl.trace("finish");
};
FrameAnimationImport.__name__ = true;
FrameAnimationImport.main = function() {
	new FrameAnimationImport(true);
};
var ImportFolder = function() {
};
ImportFolder.__name__ = true;
ImportFolder.get_instance = function() {
	if(ImportFolder.instance == null) return ImportFolder.instance = new ImportFolder(); else return ImportFolder.instance;
};
ImportFolder.prototype = {
	initialize: function(library,filename) {
		var psdName = filename.split(".psd")[0];
		this.movieclipName = psdName;
		var count = 0;
		while(true) {
			var checkFolderName;
			if(count == 0) checkFolderName = psdName; else checkFolderName = psdName + (count == null?"null":"" + count);
			if(!library.itemExists(checkFolderName)) {
				library.newFolder(checkFolderName);
				this.name = checkFolderName;
				break;
			}
			count++;
		}
	}
};
var JsonReader = function() { };
JsonReader.__name__ = true;
JsonReader.getInformation = function(frameAnimationExportFolerURI) {
	var jsonURI = [frameAnimationExportFolerURI,"json","info" + ".json"].join("/");
	return JsonReader.read(jsonURI);
};
JsonReader.getDirectoryStruture = function(frameAnimationExportFolerURI) {
	var jsonURI = [frameAnimationExportFolerURI,"json","directory","structure" + ".json"].join("/");
	return JsonReader.read(jsonURI);
};
JsonReader.getLayerStructure = function(frameAnimationExportFolerURI) {
	var jsonURI = [frameAnimationExportFolerURI,"json","layer","structure" + ".json"].join("/");
	return JsonReader.read(jsonURI);
};
JsonReader.getLayerIndex = function(frameAnimationExportFolerURI) {
	var jsonURI = [frameAnimationExportFolerURI,"json","layer","index" + ".json"].join("/");
	return JsonReader.read(jsonURI);
};
JsonReader.read = function(jsonURI) {
	var jsonString = FLfile.read(jsonURI);
	if(jsonString == null || jsonString == "") return null;
	return js.Lib["eval"](["(",jsonString,")"].join(""));
};
var LayerMargence = function() { };
LayerMargence.__name__ = true;
LayerMargence.execute = function(document) {
	var timeline = document.getTimeline();
	if(timeline.layerCount <= 1) return;
	var maxLayerIndex = timeline.layerCount - 1;
	var _g1 = 0;
	var _g = timeline.frameCount;
	while(_g1 < _g) {
		var frameIndex = _g1++;
		timeline.currentFrame = frameIndex;
		document.selectAll();
		document.clipCut();
		timeline.currentLayer = maxLayerIndex;
		document.clipPaste(true);
	}
	var _g2 = 0;
	while(_g2 < maxLayerIndex) {
		var i = _g2++;
		timeline.deleteLayer(0);
	}
};
var MovieClipCreation = function(document,layerStructure,layerIndex) {
	this.layerIndex = layerIndex;
	this.layerStructure = layerStructure;
	this.document = document;
	this.library = document.library;
};
MovieClipCreation.__name__ = true;
MovieClipCreation.prototype = {
	execute: function() {
		this.createMovieClip();
		this.createLayerFrame();
		this.putElement();
	}
	,createMovieClip: function() {
		var movieClipPath = [(ImportFolder.instance == null?ImportFolder.instance = new ImportFolder():ImportFolder.instance).name,(ImportFolder.instance == null?ImportFolder.instance = new ImportFolder():ImportFolder.instance).movieclipName].join("/");
		this.library.addNewItem(jsfl.ItemType.MOVIE_CLIP,movieClipPath);
		this.library.editItem();
		this.timeline = this.document.getTimeline();
	}
	,createLayerFrame: function() {
		var totalFrames = this.layerStructure.length - 1;
		this.timeline.insertFrames(totalFrames,true);
		var _g = 0;
		var _g1 = this.layerIndex;
		while(_g < _g1.length) {
			var path = _g1[_g];
			++_g;
			this.timeline.addNewLayer(path,jsfl.LayerType.NORMAL,false);
		}
		var _g11 = 0;
		var _g2 = this.timeline.layerCount;
		while(_g11 < _g2) {
			var i = _g11++;
			this.timeline.currentLayer = i;
			var _g21 = 0;
			while(_g21 < totalFrames) {
				var frameIndex = _g21++;
				this.timeline.insertKeyframe(frameIndex);
			}
		}
		this.timeline.deleteLayer(0);
	}
	,putElement: function() {
		var _g1 = 0;
		var _g = this.layerStructure.length;
		while(_g1 < _g) {
			var frameIndex = _g1++;
			this.timeline.currentFrame = frameIndex;
			var photoshopLayerSet = this.layerStructure[frameIndex];
			var _g3 = 0;
			var _g2 = photoshopLayerSet.length;
			while(_g3 < _g2) {
				var elementIndex = _g3++;
				var photoshopLayer = photoshopLayerSet[elementIndex];
				var layerIndex = this.timeline.findLayerIndex(photoshopLayer.path)[0];
				this.timeline.currentLayer = layerIndex;
				var libraryItemPath = this.getLibraryItemPath(photoshopLayer);
				this.library.addItemToDocument({ x : 0, y : 0},libraryItemPath);
				this.document.setInstanceAlpha(photoshopLayer.opacity);
				this.document.setElementProperty("x",photoshopLayer.x);
				this.document.setElementProperty("y",photoshopLayer.y);
			}
		}
	}
	,getLibraryItemPath: function(photoshopLayer) {
		var pathSet;
		if(photoshopLayer.directory == "") pathSet = [(ImportFolder.instance == null?ImportFolder.instance = new ImportFolder():ImportFolder.instance).name,"assets",photoshopLayer.name]; else pathSet = [(ImportFolder.instance == null?ImportFolder.instance = new ImportFolder():ImportFolder.instance).name,"assets",photoshopLayer.directory,photoshopLayer.name];
		return pathSet.join("/");
	}
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
var haxe = {};
haxe.Log = function() { };
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Lib = function() { };
js.Lib.__name__ = true;
js.Lib["eval"] = function(code) {
	return eval(code);
};
var jsfl = {};
jsfl.AlignMode = function() { };
jsfl.AlignMode.__name__ = true;
jsfl.ArrangeMode = function() { };
jsfl.ArrangeMode.__name__ = true;
jsfl.Boot = function() { };
jsfl.Boot.__name__ = true;
jsfl.Boot.trace = function(v,infos) {
	fl.trace("" + Std.string(v));
};
jsfl.ColorMode = function() { };
jsfl.ColorMode.__name__ = true;
jsfl.CompressionType = function() { };
jsfl.CompressionType.__name__ = true;
jsfl.DocumentEnterEditMode = function() { };
jsfl.DocumentEnterEditMode.__name__ = true;
jsfl.ElementType = function() { };
jsfl.ElementType.__name__ = true;
jsfl.EventType = function() { };
jsfl.EventType.__name__ = true;
jsfl.FilterType = function() { };
jsfl.FilterType.__name__ = true;
jsfl._InstanceType = {};
jsfl._InstanceType.InstanceType_Impl_ = function() { };
jsfl._InstanceType.InstanceType_Impl_.__name__ = true;
jsfl.ItemType = function() { };
jsfl.ItemType.__name__ = true;
jsfl.LayerType = function() { };
jsfl.LayerType.__name__ = true;
jsfl.Lib = function() { };
jsfl.Lib.__name__ = true;
jsfl.Lib.alert = function(alertText) {
	alert(alertText);
};
jsfl.Lib.confirm = function(strAlert) {
	return confirm(strAlert);
};
jsfl.Lib.prompt = function(promptMsg,text) {
	if(text == null) text = "";
	return prompt(promptMsg,text);
};
jsfl.Lib.throwError = function(object,posInfos) {
	jsfl.Lib.fl.trace("Error : " + Std.string(object) + " at " + posInfos.methodName + "[" + posInfos.fileName + ":" + posInfos.lineNumber + "]");
	throw object;
};
jsfl.PersistentDataType = function() { };
jsfl.PersistentDataType.__name__ = true;
jsfl._SpriteSheetExporter = {};
jsfl._SpriteSheetExporter.SpriteSheetExporterAlgorithm_Impl_ = function() { };
jsfl._SpriteSheetExporter.SpriteSheetExporterAlgorithm_Impl_.__name__ = true;
jsfl._SpriteSheetExporter.SpriteSheetExporterFormat_Impl_ = function() { };
jsfl._SpriteSheetExporter.SpriteSheetExporterFormat_Impl_.__name__ = true;
jsfl._SpriteSheetExporter.SpriteSheetExporterLayoutFormat_Impl_ = function() { };
jsfl._SpriteSheetExporter.SpriteSheetExporterLayoutFormat_Impl_.__name__ = true;
jsfl._SymbolInstance = {};
jsfl._SymbolInstance.LoopType_Impl_ = function() { };
jsfl._SymbolInstance.LoopType_Impl_.__name__ = true;
jsfl.SymbolType = function() { };
jsfl.SymbolType.__name__ = true;
jsfl._TweenType = {};
jsfl._TweenType.TweenType_Impl_ = function() { };
jsfl._TweenType.TweenType_Impl_.__name__ = true;
var lib = {};
lib.FileDirectory = function() { };
lib.FileDirectory.__name__ = true;
lib.FileDirectory.getDirectoryStructureFilePath = function(frameAnimationExportFolerURI) {
	return [frameAnimationExportFolerURI,"json","directory","structure" + ".json"].join("/");
};
lib.FileDirectory.getAssetsDirectoryPath = function(frameAnimationExportFolerURI) {
	return [frameAnimationExportFolerURI,"assets"].join("/");
};
lib.FileDirectory.getLayerStructureFilePath = function(frameAnimationExportFolerURI) {
	return [frameAnimationExportFolerURI,"json","layer","structure" + ".json"].join("/");
};
lib.FileDirectory.getLayerIndexFilePath = function(frameAnimationExportFolerURI) {
	return [frameAnimationExportFolerURI,"json","layer","index" + ".json"].join("/");
};
lib.FileDirectory.getInfomationFilePath = function(frameAnimationExportFolerURI) {
	return [frameAnimationExportFolerURI,"json","info" + ".json"].join("/");
};
String.__name__ = true;
Array.__name__ = true;
haxe.Log.trace = jsfl.Boot.trace;
jsfl.AlignMode.LEFT = "left";
jsfl.AlignMode.RIGHT = "right";
jsfl.AlignMode.TOP = "top";
jsfl.AlignMode.BOTTOM = "bottom";
jsfl.AlignMode.VERTICAL_CENTER = "vertical center";
jsfl.AlignMode.HORIZONTAL_CENTER = "horizontal center";
jsfl.ArrangeMode.BACK = "back";
jsfl.ArrangeMode.BACKWARD = "backward";
jsfl.ArrangeMode.FORWARD = "forward";
jsfl.ArrangeMode.FRONT = "front";
jsfl.ColorMode.NONE = "none";
jsfl.ColorMode.BRIGHTNESS = "brightness";
jsfl.ColorMode.TINT = "tint";
jsfl.ColorMode.ALPHA = "alpha";
jsfl.ColorMode.ADVANCED = "advanced";
jsfl.CompressionType.PHOTO = "photo";
jsfl.CompressionType.LOSSLESS = "lossless";
jsfl.DocumentEnterEditMode.IN_PLACE = "inPlace";
jsfl.DocumentEnterEditMode.NEW_WINDOW = "newWindow";
jsfl.ElementType.SHAPE = "shape";
jsfl.ElementType.TEXT = "text";
jsfl.ElementType.TLF_TEXT = "tlfText";
jsfl.ElementType.INSTANCE = "instance";
jsfl.ElementType.SHAPE_OBJ = "shapeObj";
jsfl.EventType.DOCUMENT_NEW = "documentNew";
jsfl.EventType.DOCUMENT_OPENED = "documentOpened";
jsfl.EventType.DOCUMENT_CLOSED = "documentClosed";
jsfl.EventType.MOUSE_MOVE = "mouseMove";
jsfl.EventType.DOCUMENT_CHANGED = "documentChanged";
jsfl.EventType.LAYER_CHANGED = "layerChanged";
jsfl.EventType.TIMELINE_CHANGED = "timelineChanged";
jsfl.EventType.FRAME_CHANGED = "frameChanged";
jsfl.EventType.PRE_PUBLISH = "prePublish";
jsfl.EventType.POST_PUBLISH = "postPublish";
jsfl.EventType.SELECTION_CHANGED = "selectionChanged";
jsfl.EventType.DPI_CHANGED = "dpiChanged";
jsfl.FilterType.ADJUSTCOLOR = "adjustColorFilter";
jsfl.FilterType.BEVEL = "bevelFilter";
jsfl.FilterType.BLUR = "blurFilter";
jsfl.FilterType.DROPSHADOW = "dropShadowFilter";
jsfl.FilterType.GLOW = "glowFilter";
jsfl.FilterType.GRADIENT_BEVEL = "gradientBevelFilter";
jsfl.FilterType.GRADIENT_GLOW = "gradientGlowFilter";
jsfl._InstanceType.InstanceType_Impl_.SYMBOL = "symbol";
jsfl._InstanceType.InstanceType_Impl_.BITMAP = "bitmap";
jsfl._InstanceType.InstanceType_Impl_.EMBEDDED_VIDEO = "embedded video";
jsfl._InstanceType.InstanceType_Impl_.LINKED_VIDEO = "linked video";
jsfl._InstanceType.InstanceType_Impl_.VIDEO = "video";
jsfl._InstanceType.InstanceType_Impl_.COMPILED_CLIP = "compiled clip";
jsfl.ItemType.UNDEFINED = "undefined";
jsfl.ItemType.COMPONENT = "component";
jsfl.ItemType.MOVIE_CLIP = "movie clip";
jsfl.ItemType.GRAPHIC = "graphic";
jsfl.ItemType.BUTTON = "button";
jsfl.ItemType.FOLDER = "folder";
jsfl.ItemType.FONT = "font";
jsfl.ItemType.SOUND = "sound";
jsfl.ItemType.BITMAP = "bitmap";
jsfl.ItemType.COMPILED_CLIP = "compiled clip";
jsfl.ItemType.SCREEN = "screen";
jsfl.ItemType.VIDEO = "video";
jsfl.LayerType.NORMAL = "normal";
jsfl.LayerType.GUIDE = "guide";
jsfl.LayerType.GUIDED = "guided";
jsfl.LayerType.MASK = "mask";
jsfl.LayerType.MASKED = "masked";
jsfl.LayerType.FOLDER = "folder";
jsfl.Lib.fl = fl;
jsfl.PersistentDataType.INTEGER = "integer";
jsfl.PersistentDataType.INTEGER_ARRAY = "integerArray";
jsfl.PersistentDataType.DOUBLE = "double";
jsfl.PersistentDataType.DOUBLE_ARRAY = "doubleArray";
jsfl.PersistentDataType.STRING = "string";
jsfl.PersistentDataType.BYTE_ARRAY = "byteArray";
jsfl._SpriteSheetExporter.SpriteSheetExporterAlgorithm_Impl_.BASIC = "basic";
jsfl._SpriteSheetExporter.SpriteSheetExporterAlgorithm_Impl_.MAX_RECTS = "maxRects";
jsfl._SpriteSheetExporter.SpriteSheetExporterFormat_Impl_.RGBA8888 = "RGBA8888";
jsfl._SpriteSheetExporter.SpriteSheetExporterFormat_Impl_.RGB888x = "RGB888x";
jsfl._SpriteSheetExporter.SpriteSheetExporterFormat_Impl_.RGB8 = "RGB8";
jsfl._SpriteSheetExporter.SpriteSheetExporterLayoutFormat_Impl_.COCOS2D_V2 = "cocos2dv2";
jsfl._SpriteSheetExporter.SpriteSheetExporterLayoutFormat_Impl_.COCOS2D_V3 = "cocos2dv3";
jsfl._SpriteSheetExporter.SpriteSheetExporterLayoutFormat_Impl_.EASEL_JS = "easeljs";
jsfl._SpriteSheetExporter.SpriteSheetExporterLayoutFormat_Impl_.JSON = "JSON";
jsfl._SpriteSheetExporter.SpriteSheetExporterLayoutFormat_Impl_.JSON_ARRAY = "JSON-Array";
jsfl._SpriteSheetExporter.SpriteSheetExporterLayoutFormat_Impl_.SPARROW_V1 = "Sparrow-v1";
jsfl._SpriteSheetExporter.SpriteSheetExporterLayoutFormat_Impl_.SPARROW_V2 = "Sparrow-v2";
jsfl._SpriteSheetExporter.SpriteSheetExporterLayoutFormat_Impl_.STARLING = "Starling";
jsfl._SymbolInstance.LoopType_Impl_.LOOP = "loop";
jsfl._SymbolInstance.LoopType_Impl_.PLAY_ONCE = "play once";
jsfl._SymbolInstance.LoopType_Impl_.SINGLE_FRAME = "single frame";
jsfl.SymbolType.MOVIE_CLIP = "movie clip";
jsfl.SymbolType.GRAPHIC = "graphic";
jsfl.SymbolType.BUTTON = "button";
jsfl._TweenType.TweenType_Impl_.MOTION = "motion";
jsfl._TweenType.TweenType_Impl_.SHAPE = "shape";
jsfl._TweenType.TweenType_Impl_.NONE = "none";
jsfl._TweenType.TweenType_Impl_.MOTION_OBJECT = "motion object";
lib.FileDirectory.ROOT_DIRECTORY = "";
lib.FileDirectory.PATH_COLUMN = "/";
lib.FileDirectory.IMAGE_EXTENSION = ".png";
lib.FileDirectory.JSON_EXTENSION = ".json";
lib.FileDirectory.PSD_EXTENSION = ".psd";
lib.FileDirectory.OUTPUT_DIRECTORY = "frame_animation_export";
lib.FileDirectory.ASSETS_DIRECTORY = "assets";
lib.FileDirectory.JSON_DIRECTORY = "json";
lib.FileDirectory.INFOMATION_FILE = "info" + ".json";
lib.FileDirectory.JSON_LAYER_STRUCTURE_DIRECTORY = "layer";
lib.FileDirectory.LAYER_STRUCTURE_FILE = "structure" + ".json";
lib.FileDirectory.LAYER_INDEX_FILE = "index" + ".json";
lib.FileDirectory.JSON_DIRECTORY_STRUCTURE_DIRECTORY = "directory";
lib.FileDirectory.DIRECTORY_STRUCTURE_FILE = "structure" + ".json";
lib.FileDirectory.BITMAP_DIRECTORY = "_bitmap";
FrameAnimationImport.main();
})(typeof window != "undefined" ? window : exports);
