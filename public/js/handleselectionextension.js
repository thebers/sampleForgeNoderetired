// *******************************************
// Handle Selection Extension
// *******************************************
function HandleSelectionExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

HandleSelectionExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
HandleSelectionExtension.prototype.constructor = HandleSelectionExtension;

HandleSelectionExtension.prototype.load = function () {
    if (this.viewer.toolbar) {
        // Toolbar is already available, create the UI
        this.createUI();
    } else {
        // Toolbar hasn't been created yet, wait until we get notification of its creation
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }
    return true;
};

HandleSelectionExtension.prototype.onToolbarCreated = function () {
    this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
};

HandleSelectionExtension.prototype.createUI = function () {
    //??? what does this line of code do?
    var _this = this;


    // prepare to execute the button action
    var handleSelectionToolbarButton = new Autodesk.Viewing.UI.Button('handleSelectionButton');
    handleSelectionToolbarButton.onClick = function (e) {

        /// get current selection
        var selection = _this.viewer.getSelection();
        _this.viewer.clearSelection();
        console.log("this is getSelection:",selection);
        console.log("this is the dbid:",selection[0]);
        // anything selected?
        if (selection.length > 0) {
            // create an array to store dbIds to isolate
            var dbIdsToChange = [];

            // iterate through the list of selected dbIds
            selection.forEach(function (dbId) {
                // get properties of each dbId
                _this.viewer.getProperties(dbId, function (props, selectionDBID) {
                    // output on console, for fun...
                    console.log(props);
                    var selectionDBID = props.dbId;
                    console.log(selectionDBID);
                    console.log(finalGroupedObjects);

                    var obj_selected = {};

                    //I need to ... 
                    //...1... identify if an object in finalGroupedObjects has a DBID=selectionDBID [if not=no action, if so...]
                    //...2... set obj_selected = its parent object (store the selections object and work with just it)
                    //...3... hide existing properties in properties panel [waiting on Stack overflow to answer]
                    //...4... unpack that object into the needed format for displaying as custom properties
                    //...5... once this is working implement instead of the properties button

                 /*
                 var textProp = {
        name: 'Text Property',
        value: "I'm just a text!" ,
        category: 'Meta Properties 1',
        dataType: 'text'
      };

      var linkProp = {
        name: 'Link Property',
        value: 'Visit our API portal...',
        category: 'Meta Properties 2',
        dataType: 'link',
        href: 'http://developer.autodesk.com'
      };

      var fileProp = {
        name: 'File Property',
        value: 'Click to download ...',
        category: 'Meta Properties 1',
        dataType: 'file',
        href: 'img/favicon.png',
        filename: 'favicon.png'
      };

      var imgProp = {
        name: 'Image Property',
        category: 'Meta Properties 2',
        dataType: 'img',
        href: 'img/favicon.png',
        filename: 'favicon.png'
      };

      _panel.addMetaProperty(textProp);
      _panel.addMetaProperty(linkProp);
      _panel.addMetaProperty(fileProp);
      _panel.addMetaProperty(imgProp);
      */

                    
                    /*var obj_imported = XLSX.utils.sheet_to_json(worksheet);
        //var finalGroupedObjects = [];
        obj_imported.forEach(function(objRow, rowIndex) {
            var singalParsedObject = {
                "dbId": objRow["Viewer ID"],
                "name": objRow["Name"] + " [" + objRow["Revit ID"] + "]",
                "properties": []
            }
            for (var objProperty in objRow) {
                if (objProperty !== 'Viewer ID' && objProperty !== 'Revit ID' && objProperty !== 'Name') {
                    var parsedProperty = {
                        "displayName": objProperty.split(':')[1],
                        "displayValue": objRow[objProperty],
                        "displayCategory": objProperty.split(':')[0],
                        "attributeName": objProperty.split(':')[1],
                        "type": 20,
                        "units": null,
                        "hidden": 1,
                        "precision": 0
                    };
                    singalParsedObject.properties.push(parsedProperty);
                }
            };
            finalGroupedObjects.push(singalParsedObject);*/

                    //doesn't work because this is the array position not the DBID (which is inside the object at a given position)
                    //console.log(finalGroupedObjects.selectionDBID);


                    // ask if want to isolate
                    if (confirm('Confirm ' + props.name + ' (' + props.externalId + ')?')) {
                        dbIdsToChange.push(dbId);

                        // at this point we know which elements to isolate
                        if (dbIdsToChange.length > 0) {
                            // isolate selected (and confirmed) dbIds
                            _this.viewer.isolate(dbIdsToChange);
                        }
                    }
                })
            })

        }
else {
    // if nothing selected, restore
    _this.viewer.isolate(0);
}

    };
    // handleSelectionToolbarButton CSS class should be defined on your .css file
    // you may include icons, below is a sample class:
    handleSelectionToolbarButton.addClass('handleSelectionToolbarButton');
    handleSelectionToolbarButton.setToolTip('Handle current selection');

    // SubToolbar
    this.subToolbar = (this.viewer.toolbar.getControl("MyAppToolbar") ?
        this.viewer.toolbar.getControl("MyAppToolbar") :
        new Autodesk.Viewing.UI.ControlGroup('MyAppToolbar'));
    this.subToolbar.addControl(handleSelectionToolbarButton);

    this.viewer.toolbar.addControl(this.subToolbar);
};

HandleSelectionExtension.prototype.unload = function () {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('HandleSelectionExtension', HandleSelectionExtension);