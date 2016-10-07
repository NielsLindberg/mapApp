var themeColors = ['#ffffff', '#e384a6', '#f4d499', '#4d90d6', '#c7e38c', '#9986c8', '#edf28c', '#ffd1d4', '#5ee1dc', '#b0eead', '#fef85a', '#8badd2'];
var vm;
var yelpPrefixes = {
    phone: 'Phone number: ',
    rating: 'Rating: ',
    url: 'Yelp Page: ',
    credits: 'Content is provided by yelp.com through their API service'
};


function ViewModel() {
    vm = this;
    vm.mapEntryList = [];
    vm.errorMessages = errorMessages;
    vm.loadingMessages = loadingMessages;
    vm.yelpStatic = yelpStatic;

    vm.entryList = ko.observableArray([]);
    vm.selectedItemTitle = ko.observable('Select a location');


    vm.yelpPhone = ko.observable();
    vm.yelpRatingImgUrl = ko.observable();
    vm.yelpUrl = ko.observable();
    vm.yelpName = ko.observable();

    vm.contentButtonsVisible = ko.observable(false);

    vm.panoVisible = ko.observable(false);
    vm.panoLoading = ko.observable(false);
    vm.panoError = ko.observable(false);

    vm.directionsVisible = ko.observable(false);
    vm.directionsLoading = ko.observable(false);
    vm.directionsError = ko.observable(false);

    vm.yelpVisible = ko.observable(false);
    vm.yelpContentVisible = ko.observable(false);
    vm.yelpLoading = ko.observable(false);
    vm.yelpError = ko.observable(false);


    /* this loop crated both an observable array for the list items
    aswell as a standard array for the mapmarkers the id's are generated automatically*/
    mapEntries.forEach(function(entryData, index) {
        var id = String.fromCharCode(65 + index);
        vm.entryList.push(new ListEntry(entryData, id));
        vm.mapEntryList.push(new MapEntry(entryData, id));
    });

    /*this observable array is the filtered version of entrylist, it is this array
    that is being referenced in the binding to the DOM on the item list */
    vm.entryListFiltered = ko.observableArray(vm.entryList());
    vm.initMap = function() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 55.6761,
                lng: 12.5683
            },
            zoom: 14,
            styles: styles
        });
        /* load the needed map services */
        var placeService = new google.maps.places.PlacesService(map);
        var streetService = new google.maps.StreetViewService();
        var directionsService = new google.maps.DirectionsService();

        var infoWindow = new google.maps.InfoWindow({});
        var bounds = new google.maps.LatLngBounds();
        vm.mapEntryList.forEach(function(mapEntry) {
            mapEntry.initMarker(placeService, streetService, directionsService, map, infoWindow, bounds);
        });
    };
    /* Category filter stuff */
    vm.categoriesFilter = ko.observable('All');

    /* when selecting in the drop down, this observable will be replaced by the value selected */
    vm.categoryLabelFilter = function(data, event) {
        /* forceing notefications by setting to null first */
        vm.categoriesFilter('');
        vm.categoriesFilter(data.category);
    };

    /* when selecting on a title in the item list the corresponding markers infowindow is opened
    and the result viewing buttons are binded to this item */
    vm.itemLabelFilter = function(data, event) {
        vm.mapEntryList.forEach(function(mapEntry) {
            if (mapEntry.id == data.id) {
                mapEntry.onItemSelectClearEvents();
                mapEntry.populateInfoWindow();
                mapEntry.toggleBounce();
            }
        });
        vm.selectedItemTitle(data.title);
    };

    /* this computed obersable holds the categories values in the item list */
    vm.categories = ko.computed(function() {
        var categories = ko.utils.arrayMap(vm.entryList(), function(listEntry) {
            return listEntry.category;
        });
        return categories.sort();
    }, vm);

    /* this computed observable holds the unique categoires and adds an All value used
    to select all categories */
    vm.uniqueCategories = ko.computed(function() {
        var uniqueCategories = ['All'];
        return uniqueCategories.concat(ko.utils.arrayGetDistinctValues(vm.categories()).sort());
    }, vm);

    vm.test1 = function(data, event) {
        console.log('test1');
        console.log(data);
        console.log(event);
    };
    vm.test2 = function(data, event) {
        console.log('test2');
        console.log(data);
        console.log(event);
    };

    vm.test3 = function(data, event) {
        console.log('test3');
        console.log(data);
        console.log(event);
    };
    /* for each unique categories we assign a color related to that used for the markers*/
    vm.categoryColors = {};
    vm.categoryIconColors = {};
    vm.uniqueCategories().forEach(function(category, index) {
        var color;
        var colorIcon;
        if (index < themeColors.length - 1) {
            color = themeColors[index];
            colorIcon = themeColors[index].substring(1, 7);
        } else {
            color = themeColors[themeColors.length - 1];
            colorIcon = themeColors[themeColors.length - 1].substring(1, 7);
        }
        vm.categoryColors[category] = color;
        vm.categoryIconColors[category] = colorIcon;
    });

    /* this method filters the markers based on the category dropdown value
    when any markers are filtered we call the onItemSelectClearEvents function to remove any
    views & bindings related to single markers. The goal is that bindigns and views or markers are only
    shown when clicking a list item or a marker item. */
    vm.filterMarkers = function() {
        vm.mapEntryList.forEach(function(mapEntry) {
            mapEntry.onItemSelectClearEvents();
            if (mapEntry.category == vm.categoriesFilter() || vm.categoriesFilter() == 'All') {
                mapEntry.showMarker();
            } else {
                mapEntry.hideMarker();
            }
        });
    };

    /* When anything changes in the categories filter we filter on the entryListfiltered
    which is the one that is referenced in the dom for the item list */
    vm.categoriesFilter.subscribe(function() {
        var filter = vm.categoriesFilter();
        vm.selectedItemTitle('Select a location');
        if (!filter || filter == 'All') {
            vm.entryListFiltered(vm.entryList());
        } else {
            vm.entryListFiltered(ko.utils.arrayFilter(vm.entryList(), function(listEntry) {
                return listEntry.category == filter;
            }));
        }
    });

    /* To ensure consistency between the map markers and the entrylist items, we subscribe to the
    entrylist and filter the map markers on any changes */
    vm.entryListFiltered.subscribe(function() {
        vm.filterMarkers();
    });
}

ko.applyBindings(new ViewModel());
