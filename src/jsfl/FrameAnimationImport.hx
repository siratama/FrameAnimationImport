package;

import jsfl.FLfile;
import jsfl.Library;
import jsfl.Item;
import jsfl.Lib;
import jsfl.Lib.fl;

@:expose("FrameAnimationImport")
class FrameAnimationImport
{
	private var library:Library;

	public static function main(){
		#if jsfl
		new FrameAnimationImport();
		#end
	}
	public function new()
	{
		if(Lib.fl.getDocumentDOM() == null) return;
		Lib.fl.trace("--- FrameAnimationImport ---");

		var folderURI = fl.browseForFolderURL();
		if(folderURI == null){

			return;
		}
		var fileURI = "";
		FLfile.read(fileURI);

		//parse json


		var document = fl.getDocumentDOM();
		library = document.library;

		document.importFile();
		document.addItem();

		/*
		library = Lib.fl.getDocumentDOM().library;
		var selectedItems = library.getSelectedItems();

		if(selectedItems.length == 0){
			Lib.fl.trace("Select item in library.");
			return;
		}
		CopyNameRule.FOLDER = folderCopyName;
		CopyNameRule.FILE = fileCopyName;

		var selectedItemParser = new SelectedItemParser(library, selectedItems);
		var duplicationSymbolMap = selectedItemParser.execute();

		var errorNameSet = execute(duplicationSymbolMap);
		outputErrorNameSet(errorNameSet);
		*/
	}
	private function execute(duplicationSymbolMap:Map<String, Array<Symbol>>):Array<String>
	{
		var errorNameSet = [];
		for(copiedDirectoryPath in duplicationSymbolMap.keys())
		{
			var symbols:Array<Symbol> = duplicationSymbolMap[copiedDirectoryPath];
			for (i in 0...symbols.length)
			{
				var symbol = symbols[i];
				if(library.itemExists(symbol.duplicationItemPath)){
					errorNameSet.push(symbol.originalItemPath);
					continue;
				}

				library.selectItem(symbol.originalItemPath);
				if(!library.duplicateItem(symbol.originalItemPath)){
					errorNameSet.push(symbol.originalItemPath);
					continue;
				}

				if(!library.itemExists(symbol.copiedBaseDirectoryPath)){
					library.newFolder(symbol.copiedBaseDirectoryPath);
				}
				library.moveToFolder(symbol.copiedBaseDirectoryPath);
				library.getSelectedItems()[0].name = symbol.name + CopyNameRule.FILE;

				trace('${symbol.originalItemPath} -> ${symbol.duplicationItemPath}');
			}
		}
		return errorNameSet;
	}
	private function outputErrorNameSet(errorNameSet:Array<String>)
	{
		var errorNameSetLength = errorNameSet.length;
		if(errorNameSetLength == 0) return;

		Lib.fl.trace("*** failed items ***");
		for(i in 0...errorNameSetLength)
		{
			Lib.fl.trace(errorNameSet[i]);
		}
	}
}
