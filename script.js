const IGNORE_CAPITALIZATION = true;
const SORT_CHECKED_TO_TOP = true;
const SORT_PLAYLISTS_TO_TOP = [
	'Watch later',
	'Temp',
];

function sortPlaylists(playlistsNode) {

	if (!playlistsNode) {
		return;
	}

	const playlists = [...playlistsNode.childNodes];
	playlists.sort((a, b) => {

		if (SORT_CHECKED_TO_TOP) {
			const aChecked = a.querySelector('#checkbox').ariaChecked == 'true';
			const bChecked = b.querySelector('#checkbox').ariaChecked == 'true';

			if (aChecked && !bChecked) {
				return -1;
			} else if (!aChecked && bChecked) {
				return 1;
			}
		}

		let aName = a.querySelector('#label').textContent;
		let bName = b.querySelector('#label').textContent;

		for (let i = 0; i < SORT_PLAYLISTS_TO_TOP.length; i++) {
			const playlistName = SORT_PLAYLISTS_TO_TOP[i];
			if (aName == playlistName) {
				return -1;
			} else if (bName == playlistName) {
				return 1;
			}
		}

		if (IGNORE_CAPITALIZATION) {
			aName = aName.toLowerCase();
			bName = bName.toLowerCase();
		}

		return aName == bName ? 0 : (aName > bName ? 1 : -1);
	});

	playlistsNode.innerHTML = '';
	playlists.forEach(p => {
		playlistsNode.appendChild(p);
	});
}

// The initial MutationObserver is used to detect when the playlists div is added to the DOM.
// Once this occurs, it is disconnected and the main MutationObserver is created and detects class changes on the playlists div.
// When a change is detected, the playlists div is sorted.

new MutationObserver((bodyMutations, initialObserver) => {

	bodyMutations.forEach(bodyMutation => {
		[...bodyMutation.addedNodes].forEach(node => {

			const playlistsNode = node?.querySelector('div#playlists');
			if (playlistsNode) {

				new MutationObserver(playlistMutations => {
					sortPlaylists(playlistsNode);
				}).observe(playlistsNode, {
					attributes: true,
					attributeFilter: ['class']
				});

				initialObserver.disconnect();
			}
		});
	});
}).observe(document.body, {
	childList: true
});

console.log("Alphabetize YouTube 'Save to Playlist' Menu extension loaded!");