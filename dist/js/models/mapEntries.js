function MapEntryViewModel(){var a=this;this.mapEntryList=ko.observableArray([]),mapEntries.forEach(function(b){a.mapEntryList.push(new MapEntry(b))})}var mapEntries=[{name:"Islands Brygge",description:"City harbor bath",tags:["leasure","bathing","beachvolley","sports"]},{name:"Kebabistan",description:"Best Vesterbro Shawarma",tags:["food","turkish","fastfood"]}],MapEntry=function(a){this.name=a.name,this.description=a.description,this.tags=a.tags};ko.applyBindings(new MapEntryViewModel);