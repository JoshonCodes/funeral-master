// var firebaseConfig = {
//   apiKey: "AIzaSyBA_QgU0PyaxoORFuyAh7GXVfK8mXTpKSo",
//   authDomain: "funeral-project.firebaseapp.com",
//   databaseURL: "https://funeral-project.firebaseio.com",
//   projectId: "funeral-project",
//   storageBucket: "funeral-project.appspot.com",
//   messagingSenderId: "763093454985",
//   appId: "1:763093454985:web:705d9088269bb7e1d87658",
//   measurementId: "G-JMF0YEPPWB"
// };

var firebaseConfig = {
	apiKey: 'AIzaSyC0zZJb3amu5tCUAEsIzUnb-iR8KTtCE-w',
	authDomain: 'funeraldb.firebaseapp.com',
	databaseURL: 'https://funeraldb.firebaseio.com',
	projectId: 'funeraldb',
	storageBucket: 'funeraldb.appspot.com',
	messagingSenderId: '58791958098',
	appId: '1:58791958098:web:cb46acf2150f5cd00f318b'
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// A reference to the top-level database...
const db = firebase.firestore();

// and a reference to the condolences collection within it.
const funeralRef = db.collection('condolences');

/***********
 * So there are a few things we need to use this for.
 * 1. On page load, I want to fetch all condolences, and auto-fill the
 *    appropriate pane on the page with results.
 * 1(a). I'm thinking this will likely use a firebase snapshot, so that
 *    as users are filling it in, *if another user elsewhere is also doing
 *    the same*, the listing will auto-update.
 * 2. On submission of the condolences form, we need to check the
 *    form for validity and then send it back to firebase.
 ***********/
const formEl = document.querySelector('.form-container');
const resultsEl = document.querySelector('.results-container .condolences');

/*****
 * First thing we do is set the fetch order. We want them to be retrieved
 *   in order of newest-first, pushing the others down. Then, we use the
 *   onSnapshot() event to listen for changes to the collection. If anything
 *   changes there (if a message is edited, or a new one is added, *even if
 *   not by this user*), we get it immediately, and we can reflect it
 *   right away.
 */
funeralRef.orderBy('added', 'desc').onSnapshot(function(response) {
	// Empty the results pane
	resultsEl.innerHTML = '';

	/***
	 * Iterate over the collection of condolence messages, and generate a custom
	 *   template DOM fragment for it. Then we inject it into the resultsEl.
	 */
	response.docs.forEach(doc => {
		const { name, message } = doc.data();

		const template = `<div class='condolence'><span class='message'>${message}</span><span class='name'>${name}</span></div>`;
		let frag = document.createRange().createContextualFragment(template);
		resultsEl.appendChild(frag);
	});
});

// regular expression for validation
const regEx = {
	name: /[A-Za-z\.\-\_\s]+/,
	phone: /([+])?([0-9]){6,}/
};

formEl
	.querySelector("button[type='submit']")
	.addEventListener('click', event => {
		event.preventDefault();
		// let's gather the form fields:
		const condolence = {
			name: formEl.querySelector("[name='name']").value,
			phone: formEl.querySelector("[name='phone']").value,
			message: formEl.querySelector("[name='message'").value,
			added: Date.now()
		};

		const clearFields = () => {
			formEl.querySelector("[name='name']").value = '';
			formEl.querySelector("[name='phone']").value = '';
			formEl.querySelector("[name='message'").value = '';
		};

		// run some validation check
		if (
			regEx.name.test(condolence.name) &&
			regEx.phone.test(condolence.phone) &&
			condolence.message !== ''
		) {
			// And this injects the condolence message in.
			funeralRef
				.doc(condolence.phone)
				.set(condolence)
				// We don't have to worry about handling any then, really, as the snapshot
				//  handler is taking care of this for us.
				.then(() => {
					console.log('Successfully added!');
					clearFields();
				})
				.catch(err => console.error(`No dice: ${err}`));
		} else {
			alert('Please fill the empty field');
		}
	});
