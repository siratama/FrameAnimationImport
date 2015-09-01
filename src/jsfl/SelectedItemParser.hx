package;

import jsfl.Library;
import jsfl.Item;
import jsfl.ItemType;

class SelectedItemParser
{
	private var library:Library;
	private var selectedItems:Array<Item>;

	private var directoryMap:Map<String, Array<String>>;
	private var sameBaseDirectorySymbolsMap:Map<String, Array<Symbols>>;

	public function new(library:Library, selectedItems:Array<Item>)
	{
		this.library = library;
		this.selectedItems = selectedItems;
	}
	public function execute():Map<String, Array<Symbol>>
	{
		splitDirectoryPathAndSymbol();
		divideSameBaseDirectorySymbols();
		var duplicationSymbolMap = decideBaseCopyDirectory();
		return duplicationSymbolMap;
	}

	//
	private function splitDirectoryPathAndSymbol()
	{
		directoryMap = new Map();

		for(i in 0...selectedItems.length)
		{
			var item = selectedItems[i];
			if(item.itemType == ItemType.FOLDER) continue;

			var itemPath = item.name;
			var fileDirectoryNameSet = itemPath.split(Common.PATH_CLUM);
			var symbolName = fileDirectoryNameSet.pop();

			var directoryPath = fileDirectoryNameSet.join(Common.PATH_CLUM);
			if(directoryMap[directoryPath] == null)
				directoryMap[directoryPath] = [];

			directoryMap[directoryPath].push(symbolName);
		}
	}

	//
	private function divideSameBaseDirectorySymbols()
	{
		sameBaseDirectorySymbolsMap = new Map();

		for(directoryPath in directoryMap.keys())
		{
			var directoryNameSet = directoryPath.split(Common.PATH_CLUM);
			var baseDirectory = directoryNameSet[0];

			if(sameBaseDirectorySymbolsMap[baseDirectory] == null)
				sameBaseDirectorySymbolsMap[baseDirectory] = [];

			if(isFinishedChecking(directoryPath, sameBaseDirectorySymbolsMap[baseDirectory])) continue;

			sameBaseDirectorySymbolsMap[baseDirectory].push(
				new Symbols(directoryPath, directoryMap[directoryPath])
			);

			addSameBaseDirectorySymbols(directoryPath, baseDirectory);
		}
	}
	private function isFinishedChecking(directoryPath:String, sameBaseDirectorySymbolsSet:Array<Symbols>):Bool
	{
		for (i in 0...sameBaseDirectorySymbolsSet.length)
		{
			var sameBaseDirectorySymbols = sameBaseDirectorySymbolsSet[i];
			if(sameBaseDirectorySymbols.directoryPath == directoryPath) return true;
		}
		return false;
	}
	private function addSameBaseDirectorySymbols(baseDirectoryPath:String, baseDirectory:String)
	{
		for(directoryPath in directoryMap.keys())
		{
			if(baseDirectoryPath == directoryPath) continue;

			var directoryNameSet = directoryPath.split(Common.PATH_CLUM);
			if(baseDirectory != directoryNameSet[0]) continue;

			sameBaseDirectorySymbolsMap[baseDirectory].push(
				new Symbols(directoryPath, directoryMap[directoryPath])
			);
		}
	}

	//
	private function decideBaseCopyDirectory():Map<String, Array<Symbol>>
	{
		var duplicationSymbolMap:Map<String, Array<Symbol>> = new Map();

		for(baseDirectory in sameBaseDirectorySymbolsMap.keys())
		{
			var mostShortDirectoryNameSet:Array<String> = null;
			var symbolsSet:Array<Symbols> = sameBaseDirectorySymbolsMap[baseDirectory];
			for(symbols in symbolsSet)
			{
				var directoryNameSet = symbols.directoryPath.split(Common.PATH_CLUM);
				if(
					mostShortDirectoryNameSet == null ||
					directoryNameSet.length < mostShortDirectoryNameSet.length
				){
					mostShortDirectoryNameSet = directoryNameSet;
				}
			}
			var baseDirectoryPath = mostShortDirectoryNameSet.join(Common.PATH_CLUM);
			var copiedDirectoryPath = baseDirectoryPath + CopyNameRule.FOLDER;

			for(symbols in symbolsSet)
			{
				var symbolSet = symbols.decideDuplicationPath(baseDirectoryPath, copiedDirectoryPath);
				if(duplicationSymbolMap[copiedDirectoryPath] == null)
					duplicationSymbolMap[copiedDirectoryPath] = [];

				duplicationSymbolMap[copiedDirectoryPath] =
					duplicationSymbolMap[copiedDirectoryPath].concat(symbolSet);
			}
		}
		return duplicationSymbolMap;
	}
}
class Symbols
{
	public var directoryPath(default, null):String;
	private var symbolNames:Array<String>;

	public function new(directoryPath:String, symbolNames:Array<String>)
	{
		this.directoryPath = directoryPath;
		this.symbolNames = symbolNames;
	}
	public function decideDuplicationPath(baseDirectoryPath:String, copiedDirectoryPath:String):Array<Symbol>
	{
		var symbols:Array<Symbol> = [];
		var branchPath = directoryPath.substring(baseDirectoryPath.length);
		var copiedBaseDirectoryPath = copiedDirectoryPath + branchPath;
		for (symbolName in symbolNames)
		{
			var originalItemPath = (directoryPath == "") ? symbolName: directoryPath + Common.PATH_CLUM + symbolName;
			var duplicationItemPath = copiedBaseDirectoryPath + Common.PATH_CLUM + symbolName + CopyNameRule.FILE;

			var symbol = new Symbol(symbolName, copiedBaseDirectoryPath, originalItemPath, duplicationItemPath);
			symbols.push(symbol);
		}
		return symbols;
	}
}
