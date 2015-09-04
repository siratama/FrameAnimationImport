(function ($hx_exports) { "use strict";
var AssetsLoader = function(document,frameAnimationExportFolerURI,directoryStructure) {
	this.document = document;
	this.library = document.library;
	this.frameAnimationExportFolerURI = frameAnimationExportFolerURI;
	this.directoryStructure = directoryStructure;
	this.assetsDirectoryPath = [frameAnimationExportFolerURI,"assets"].join("/");
};
AssetsLoader.__name__ = true;
AssetsLoader.prototype = {
	execute: function() {
		this.roop(this.directoryStructure,"");
	}
	,roop: function(directory,parentRelativeDirectoryPath) {
		var relativeDirectoryPath;
		if(directory.name == "") relativeDirectoryPath = parentRelativeDirectoryPath; else relativeDirectoryPath = [parentRelativeDirectoryPath,directory.name].join("/");
		var directoryPath = this.assetsDirectoryPath + relativeDirectoryPath;
		var folderPath = "frame_animation_export" + relativeDirectoryPath;
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
var FrameAnimationImport = $hx_exports.FrameAnimationImport = function() {
	if(jsfl.Lib.fl.getDocumentDOM() == null) return;
	jsfl.Lib.fl.trace("--- FrameAnimationImport ---");
	var frameAnimationExportFolerURI = jsfl.Lib.fl.browseForFolderURL("Select " + "frame_animation_export" + ".");
	if(frameAnimationExportFolerURI == null) return;
	var directoryStructure = JsonReader.getDirectoryStruture(frameAnimationExportFolerURI);
	if(directoryStructure == null) {
		jsfl.Lib.fl.trace("not found: " + [frameAnimationExportFolerURI,"json","directory","default" + ".json"].join("/") + "}}");
		return;
	}
	var document = jsfl.Lib.fl.getDocumentDOM();
	var assetsLoader = new AssetsLoader(document,frameAnimationExportFolerURI,directoryStructure);
	assetsLoader.execute();
	var layerStructure = JsonReader.getLayerStructure(frameAnimationExportFolerURI);
	var test = new Test(document,layerStructure);
	test.execute();
};
FrameAnimationImport.__name__ = true;
FrameAnimationImport.main = function() {
};
var JsonReader = function() { };
JsonReader.__name__ = true;
JsonReader.getDirectoryStruture = function(frameAnimationExportFolerURI) {
	var jsonURI = [frameAnimationExportFolerURI,"json","directory","default" + ".json"].join("/");
	var jsonString = FLfile.read(jsonURI);
	if(jsonString == null) return null;
	var directoryStructure = js.Lib["eval"](["(",jsonString,")"].join(""));
	return directoryStructure;
};
JsonReader.getLayerStructure = function(frameAnimationExportFolerURI) {
	var jsonURI = [frameAnimationExportFolerURI,"json","layer","default" + ".json"].join("/");
	var jsonString = FLfile.read(jsonURI);
	if(jsonString == null) return null;
	var layerStructure = js.Lib["eval"](["(",jsonString,")"].join(""));
	return layerStructure;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
var Test = function(document,layerStructure) {
	this.layerStructure = layerStructure;
	this.document = document;
	this.library = document.library;
};
Test.__name__ = true;
Test.prototype = {
	execute: function() {
		var psdFileName = "test_movieclip";
		this.library.addNewItem(jsfl.ItemType.MOVIE_CLIP,psdFileName);
		this.library.editItem();
		var timeline = this.document.getTimeline();
		var _g1 = 0;
		var _g = this.layerStructure.length;
		while(_g1 < _g) {
			var frameIndex = _g1++;
			var photoshopLayerSet = this.layerStructure[frameIndex];
			timeline.selectAllFrames();
			timeline.insertKeyframe(frameIndex);
			var _g3 = 0;
			var _g2 = photoshopLayerSet.length;
			while(_g3 < _g2) {
				var elementIndex = _g3++;
				var photoshopLayer = photoshopLayerSet[elementIndex];
				var layerIndexSet = timeline.findLayerIndex(photoshopLayer.name);
				var layerIndex;
				if(layerIndexSet == null) layerIndex = timeline.addNewLayer(photoshopLayer.name,jsfl.LayerType.NORMAL,false); else layerIndex = layerIndexSet[0];
				timeline.currentLayer = layerIndex;
				var layer = timeline.layers[layerIndex];
				var libraryItemPath = ["frame_animation_export",photoshopLayer.directory,photoshopLayer.name].join("/");
				this.library.addItemToDocument({ x : 0, y : 0},libraryItemPath);
				var element = layer.frames[frameIndex].elements[elementIndex];
				element.x = photoshopLayer.x;
				element.y = photoshopLayer.y;
				return;
			}
		}
	}
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
lib.FileDirectory.getDirectoryStructureDefaultFilePath = function(frameAnimationExportFolerURI) {
	return [frameAnimationExportFolerURI,"json","directory","default" + ".json"].join("/");
};
lib.FileDirectory.getAssetsDirectoryPath = function(frameAnimationExportFolerURI) {
	return [frameAnimationExportFolerURI,"assets"].join("/");
};
lib.FileDirectory.getLayerStructureDefaultFilePath = function(frameAnimationExportFolerURI) {
	return [frameAnimationExportFolerURI,"json","layer","default" + ".json"].join("/");
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
lib.FileDirectory.OUTPUT_DIRECTORY = "frame_animation_export";
lib.FileDirectory.ASSETS_DIRECTORY = "assets";
lib.FileDirectory.JSON_DIRECTORY = "json";
lib.FileDirectory.JSON_LAYER_STRUCTURE_DIRECTORY = "layer";
lib.FileDirectory.LAYER_STRUCTURE_DEFAULT_FILE = "default" + ".json";
lib.FileDirectory.LAYER_STRUCTURE_ARRAY_FILE = "array" + ".json";
lib.FileDirectory.JSON_DIRECTORY_STRUCTURE_DIRECTORY = "directory";
lib.FileDirectory.DIRECTORY_STRUCTURE_DEFAULT_FILE = "default" + ".json";
lib.FileDirectory.DIRECTORY_STRUCTURE_PATH_FILE = "path" + ".json";
lib.FileDirectory.BITMAP_DIRECTORY = "_bitmap";
FrameAnimationImport.main();
})(typeof window != "undefined" ? window : exports);
