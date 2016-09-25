var mapEntries=[{title:"Copenhagen Business School, Solbjerg Campus",description:"The main campus of CBS",id:"A",category:"school",tags:["school","campus","cbs"]},{title:"Harbor Bath, Islands Brygge",description:"City harbor bath",id:"B",category:"leasure",tags:["leasure","bathing","beachvolley","sports"]},{title:"Harbor Bath, Kalvebod Brygge",description:"City harbor bath",id:"C",category:"leasure",tags:["leasure","bathing","beachvolley","sports"]},{title:"Kebabistan, Istedgade",description:"Nr.1 Vesterbro Shawarma",id:"D",category:"food",tags:["food","turkish","fastfood"]},{title:"Riccos Fælledvej",description:"Nice café for studying.",id:"E",category:"leasure",tags:["café","coffee","study"]},{title:"KB18",description:"House/Techno Club in the Meatpacking district",id:"F",category:"party",tags:["music","club","techno","house"]},{title:"Culture Box",description:"The main House/Techno club in Copenhagen.",id:"G",category:"party",tags:["music","club","techno","house"]},{title:"Boulevarden Bodega, Sønder Boulevard",description:"Bodega at Sønder Boulevard",id:"H",category:"party",tags:["bodega","billiard"]},{title:"Scarpetta, Rantzausgade",description:"Nice medium priced italian restaurant",id:"I",category:"food",tags:["food","italian","restaurant"]},{title:"Five Star, Nørrebrogade",description:"Indian style durums",id:"I",category:"food",tags:["food","indian","fastfood"]}],Entry=function(a){this.title=a.title,this.description=a.description,this.id=a.id,this.category=a.category,this.tags=a.tags},ListEntry=function(a){Entry.call(this,a)};ListEntry.prototype=Object.create(Entry.prototype),ListEntry.prototype.constructor=ListEntry;var MapEntry=function(a){Entry.call(this,a),this.radius=100,this.placeService=null,this.streetService=null,this.directionsService=null,this.map=null,this.infoWindow=null,this.panorama=null,this.directions=null,this.bounds=null};MapEntry.prototype=Object.create(Entry.prototype),MapEntry.prototype.constructor=MapEntry,MapEntry.prototype.initMarker=function(a,b,c,d,e,f){function g(a,b){b==google.maps.places.PlacesServiceStatus.OK&&(h.addQueryResultToObject(a[0]),h.addMarkerData(),h.showMarker(),h.map.fitBounds(h.bounds))}var h=this;this.placeService=a,this.streetService=b,this.directionsService=c,this.map=d,this.infoWindow=e,this.bounds=f;var i={query:h.title};a.textSearch(i,g)},MapEntry.prototype.addQueryResultToObject=function(a){var b=this;this.placeData=a,this.location=a.geometry.location,this.formattedName=a.formatted_address,this.icon=new google.maps.MarkerImage("http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld="+b.id+"|"+categoryColorsIcon[b.category]+"|000000",new google.maps.Size(20,32),new google.maps.Point(0,0),new google.maps.Point(20,32),new google.maps.Size(20,32))},MapEntry.prototype.addMarkerData=function(){var a=this;this.marker=new google.maps.Marker({title:a.title,animation:google.maps.Animation.DROP,id:a.id,icon:a.icon,position:a.location}),a.marker.addListener("click",function(){a.populateInfoWindow()})},MapEntry.prototype.showMarker=function(){this.marker.setMap(this.map),this.bounds.extend(this.marker.position)},MapEntry.prototype.hideMarker=function(){this.marker.setMap(null)},MapEntry.prototype.populateInfoWindow=function(){if(this.infoWindow.marker!=this.marker){var a=this;this.infoWindow.setContent('<div id="infowindow">'+a.title+"</div>"),this.infoWindow.marker=this.marker,this.infoWindow.open(this.map,this.marker),this.infoWindow.addListener("closeclick",function(){a.infoWindow.marker=null,a.hideDisplayDirections(),a.hidePanoramaView(a),a.unBindButtonsFromMarker()}),this.unBindButtonsFromMarker(),this.bindButtonsToMarker(a)}},MapEntry.prototype.unBindButtonsFromMarker=function(){$("#show-panorama").unbind("click"),$("#show-photos").unbind("click"),$("#show-directions").unbind("click")},MapEntry.prototype.bindButtonsToMarker=function(a){$("#show-panorama").click(function(){a.hideDisplayDirections(),a.createPanoramaView(a)}),$("#show-photos").click(function(){a.hideDisplayDirections(),a.createPanoramaView(a)}),$("#show-directions").click(function(){a.hidePanoramaView(a),a.displayDirections(a)})},MapEntry.prototype.hidePanoramaView=function(){$("#pano").css("display","none")},MapEntry.prototype.hideDisplayDirections=function(){directionsDisplayList.length>0&&directionsDisplayList.forEach(function(a){a.setMap(null),a.setDirections({routes:[]})}),$("#directions").css("display","none")},MapEntry.prototype.createPanoramaView=function(a){function b(b,c){if(c==google.maps.StreetViewStatus.OK){var d=b.location.latLng,e=google.maps.geometry.spherical.computeHeading(d,a.marker.position),f={position:d,linksControl:!1,panControl:!1,enableCloseButton:!1,pov:{heading:e,pitch:0}};a.panorama=new google.maps.StreetViewPanorama(document.getElementById("pano"),f)}}a.streetService=new google.maps.StreetViewService,a.streetService.getPanoramaByLocation(a.marker.position,a.radius,b),$("#pano").css({display:"flex",flex:1})};var directionsDisplayList=[];MapEntry.prototype.displayDirections=function(a){a.directionsService=new google.maps.DirectionsService,a.hideDisplayDirections();var b=mapEntryList[0].location,c=a.location,d="TRANSIT";a.directionsService.route({origin:b,destination:c,travelMode:google.maps.TravelMode[d]},function(b,c){if(c===google.maps.DirectionsStatus.OK){var d=new google.maps.DirectionsRenderer({map:a.map,directions:b,draggable:!1,polylineOptions:{strokeColor:"#282828"},markerOptions:{visible:!1},preserveViewport:!0});d.setPanel(document.getElementById("directions")),directionsDisplayList.push(d),a.directions=d}else window.alert("Directions request failed due to "+c)}),$("#directions").css({display:"flex",flex:1})};