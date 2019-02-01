'use strict';
var lessButton = document.getElementById('lessPics'),
	moreButton = document.getElementById('morePics'),
	picsAmount = document.getElementById('picsAmt'),
	buildGallery = document.getElementById('buildPics'),
	picsContainer = document.getElementsByTagName('main')[0],
	sumButton = document.getElementById('summary'),
	asideTable = document.getElementsByTagName('aside')[0];

sumButton.style.display = 'none';

//Events

// Event for button "less" - deleting last child of main on clik, w/ checking amt is in 0-30
lessButton.addEventListener('click', function() {
	if (picsAmount.value>0) {
		picsAmount.value--;
		if (document.getElementsByTagName('img').length){
			picsContainer.lastChild.remove();
			sumButtonSwitch();
			if (document.getElementsByClassName('createdtable')[0]) {
				document.getElementsByClassName('createdtable')[0].remove();
			}
		};
	};
});


// Event for button "more" - rinnig adding function on clik, w/ checking amt is in 0-30
moreButton.addEventListener('click', function() {
	if (picsAmount.value < 30) {
		picsAmount.value++;
		addPics(picsAmount.value);
	}		
});


//Checking amt is in 0-30
picsAmount.addEventListener('input', function() {
	if (picsAmount.value<0) {
		picsAmount.value = 0;
	} 
	else {
		if (picsAmount.value>30) {
			picsAmount.value = 30;
		}
	}	
});


//Multiple pic adding function on input unfocus
picsAmount.addEventListener('blur', builder);


//Multiple pic adding function on "Build" button click
buildGallery.addEventListener('click', builder);


//Multiple pic adding function on input press Enter
picsAmount.addEventListener('keydown', function(event) {

	if (event.keyCode === 13) {
		builder();
	}

});

//Creating table on Summary table button click
sumButton.addEventListener('click', createSumTable);



//Handlers

//One pic adding function w/ url depending on argument
function addPics(counter) {
		if (document.getElementsByClassName('createdtable')[0]) {
			document.getElementsByClassName('createdtable')[0].remove();
		}
		var pic = document.createElement('img'),
			picCell = document.createElement('div'),
			sign = document.createElement('span'),
			size;
		pic.src = 'img/'+counter+'.jpg';
		picCell.classList.add('myImage');

		picCell.addEventListener('mouseover', function() {
			sign.style.opacity = 1;
		});
		picCell.addEventListener('mouseout', function() {
			sign.style.opacity = 0;
		});
		picsContainer.appendChild(picCell);
		picCell.appendChild(sign);
		picCell.appendChild(pic);
		picSize(pic.src, function(kb) {
			size = kb;
			//Adding pic size from AJAX request
			sign.innerHTML ='Size is ' + size + 'Kb';
		});
		//On picture loaded adding real height and width
		pic.addEventListener('load', function() {
				sign.innerHTML += ' , Width: ' + pic.naturalWidth + ', Height: ' + pic.naturalHeight;
		});
		sign.style.opacity = 0;
		sumButtonSwitch();
};


//Remove all pics function
function removePics() {
		picsContainer.innerHTML= '';
		sumButtonSwitch();
};


//Multiple adding function w/ checking amt changes
function builder() {
	if (document.getElementsByTagName('img').length != picsAmount.value){
		removePics();
		for (var i = 1; i <= picsAmount.value; i++) {
			addPics(i);
		};
	};	
};


//Appearing of summary table button
function sumButtonSwitch() {
	if (sumButton.style.display == 'none' && document.getElementsByClassName('myImage').length > 0) {
		sumButton.style.display = 'inline';
	}
	else {
		if (document.getElementsByClassName('myImage').length == 0) {
			sumButton.style.display = 'none';	
		}
	}
}


//Create table on Summury button click
function createSumTable() {
	if (asideTable.firstChild)
		{
		asideTable.firstChild.remove();
	}
	var sumTable = document.createElement('table'),
		titleTr = document.createElement('tr');

	sumTable.classList.add('createdtable');
	asideTable.appendChild(sumTable);
	sumTable.appendChild(titleTr);

	titleTr.appendChild(document.createElement('td'));
	titleTr.lastChild.innerHTML = 'Image';
	titleTr.appendChild(document.createElement('td'));
	titleTr.lastChild.innerHTML = 'Height';
	titleTr.appendChild(document.createElement('td'));
	titleTr.lastChild.innerHTML = 'Width';
	titleTr.appendChild(document.createElement('td'));
	titleTr.lastChild.innerHTML = 'Size';

	for (var i = 0; i < document.getElementsByClassName('myImage').length; i++) {
		var sumTr = document.createElement('tr');
		sumTable.appendChild(sumTr);
		sumTr.appendChild(document.createElement('td'));
		sumTr.lastChild.innerHTML = 'Picture number ' + (i+1);

		sumTr.appendChild(document.createElement('td'));
		sumTr.lastChild.innerHTML = document.getElementsByClassName('myImage')[i].lastChild.naturalHeight;

		sumTr.appendChild(document.createElement('td'));
		sumTr.lastChild.innerHTML = document.getElementsByClassName('myImage')[i].lastChild.naturalWidth;

		sumTr.appendChild(document.createElement('td'));
		sumTr.lastChild.innerHTML = document.getElementsByClassName('myImage')[i].firstChild.innerHTML.substring(8, 12);
	}	
}






//AJAX request to server to get picture size
function picSize(picUrl, callback) {
		var getSize = new XMLHttpRequest(),
		result;

		getSize.open('HEAD', picUrl); 

		getSize.onreadystatechange = function() {
			if ( getSize.readyState == 4 ) {
	    		if ( getSize.status == 200 ) {
	      			result = getSize.getResponseHeader('Content-Length')/1024;
	      			result = Math.round(result);
	      			callback(result);
	    		} 
	    		else {
	      			result = getSize.status + ' Server Error ';
	      			callback(result);
	    		}	
	  		}		
		}
		
	

		getSize.send();
		return result;

}

