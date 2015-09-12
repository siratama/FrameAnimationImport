package;

import jsfl.ItemType;
import jsfl.Library;
import jsfl.Document;
import lib.FileDirectory;
import lib.Directory;

class AssetsImport
{
	private var document:Document;
	private var library:Library;
	private var directoryStructure:Directory;
	private var frameAnimationExportFolerURI:String;
	private var assetsDirectoryPath:String;

	public function new(document:Document, frameAnimationExportFolerURI:String, directoryStructure:Directory)
	{
		this.document = document;
		library = document.library;

		this.frameAnimationExportFolerURI = frameAnimationExportFolerURI;
		this.directoryStructure = directoryStructure;

		assetsDirectoryPath = FileDirectory.getAssetsDirectoryPath(frameAnimationExportFolerURI);
	}
	public function execute()
	{
		roop(directoryStructure, FileDirectory.ROOT_DIRECTORY);
	}
	private function roop(directory:Directory, parentRelativeDirectoryPath:String)
	{
		var relativeDirectoryPath = (directory.name == FileDirectory.ROOT_DIRECTORY) ?
			parentRelativeDirectoryPath:
			[parentRelativeDirectoryPath, directory.name].join(FileDirectory.PATH_COLUMN);

		var directoryPath:String = assetsDirectoryPath + relativeDirectoryPath;

		var folderPath = [ImportFolder.instance.name, FileDirectory.ASSETS_DIRECTORY].join(FileDirectory.PATH_COLUMN) + relativeDirectoryPath;
		var bitmapFolderPath = [folderPath, FileDirectory.BITMAP_DIRECTORY].join(FileDirectory.PATH_COLUMN);
		createFolder(folderPath);
		createFolder(bitmapFolderPath);

		createSymbols(directory, directoryPath, folderPath, bitmapFolderPath);

		for (childDirectory in directory.directories)
			roop(childDirectory, relativeDirectoryPath);
	}

	private function createFolder(path:String)
	{
		if(!library.itemExists(path)){
			library.newFolder(path);
		}
	}
	private function createSymbols(directory:Directory, directoryPath:String, folderPath:String, bitmapFolderPath:String)
	{
		for (file in directory.files)
		{
			var fileName = file + FileDirectory.IMAGE_EXTENSION;
			var imageFilePath = [directoryPath, fileName].join(FileDirectory.PATH_COLUMN);
			document.importFile(imageFilePath, true, false);

			var symbolName = [folderPath, file].join(FileDirectory.PATH_COLUMN);
			library.addNewItem(ItemType.GRAPHIC, symbolName);
			library.editItem();
			library.addItemToDocument({x:0, y:0}, fileName);

			var element = document.getTimeline().layers[0].frames[0].elements[0];
			element.x = 0;
			element.y = 0;

			library.selectItem(fileName);
			library.moveToFolder(bitmapFolderPath);
		}
	}
}
