'use strict';
var lessButton = document.getElementById('lessPics'),
	moreButton = document.getElementById('morePics'),
	picsAmount = document.getElementById('picsAmt'),
	buildGallery = document.getElementById('buildPics'),
	picsContainer = document.getElementsByTagName('main')[0];



//Events

// Event for button "less" - deleting last child of main on clik, w/ checking amt is in 0-30
lessButton.addEventListener('click', function() {
	if (picsAmount.value>0) {
		picsAmount.value--;
		if (document.getElementsByTagName('img').length){
			picsContainer.lastChild.remove();
		};
	};
});


// Event for button "more" - rinnig adding function on clik, w/ checking amt is in 0-30
moreButton.addEventListener('click', function() {
	if (picsAmount.value<30) {
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


//Running multiple pic adding function on input unfocus
picsAmount.addEventListener('blur', builder);


//Running multiple pic adding function on "Build" button click
buildGallery.addEventListener('click', builder);


//Running multiple pic adding function on input press Enter
picsAmount.addEventListener('keydown', function(event) {
	if (event.keyCode === 13) {
		builder();
	};
});



//Handlers

//One pic adding function w/ url depending on argument
function addPics(counter) {
		var pic = document.createElement('img'),
			picCell = document.createElement('div'),
			sign = document.createElement('span'),
			size;
		pic.src = 'img/'+counter+'.jpg';

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
};


//Remove all pics function
function removePics() {
		picsContainer.innerHTML= '';
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
	      			result = 'Server Error ' + getSize.status;
	      			callback(result);
	    		}	
	  		}		
		}
		
	

		getSize.send();
		return result;

}

