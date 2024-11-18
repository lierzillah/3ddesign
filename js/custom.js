function isTouchDevice() {
	return (
		'ontouchstart' in window || window.navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0
	);
}

function calcViewportHeight() {
	if (isTouchDevice()) {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}
}

function popupShow(openBtn, closeBtn, popupBlock) {
	const openPopupBtn = document.querySelectorAll(openBtn);
	const closePopupBtn = document.querySelector(closeBtn);
	const popup = document.querySelector(popupBlock);

	if (openPopupBtn) {
		openPopupBtn.forEach((button) => {
			button.addEventListener('click', (e) => {
				e.preventDefault();
				popup.classList.add('active');
				document.body.classList.add('lock');
			});
		});
	}

	if (closePopupBtn) {
		closePopupBtn.addEventListener('click', () => {
			popup.classList.remove('active');
			document.body.classList.remove('lock');
		});
	}
}

function scrollTo(elementFrom, elementTo) {
	const fromElement = document.querySelector(elementFrom);
	const toElement = document.querySelector(elementTo);
	const headerBlock = document.querySelector('header');

	let headerHeight;

	if (headerBlock.offsetHeight > 76) {
		headerHeight = 76;
	} else {
		headerHeight = headerBlock.offsetHeight;
	}

	if (!fromElement) return;

	fromElement.addEventListener('click', () => {
		window.scroll({
			behavior: 'smooth',
			left: 0,
			top: toElement.offsetTop - headerHeight,
		});
	});
}

function heroAnimation() {
	const $logo = document.querySelector('.js-logo');
	const $tags = document.querySelectorAll('.js-tag');
	const $actions = document.querySelectorAll('.js-action');

	if (!$logo || !$tags.length || !$actions.length) {
		gsap.set($actions, { opacity: 1 });

		return;
	}

	gsap.set($actions, { opacity: 0 });

	const tl = gsap.timeline();

	tl.fromTo($logo, { opacity: 0, duration: 0.5 }, { opacity: 0.7, duration: 0.3 })
		.fromTo(
			$logo,
			{ opacity: 0.7, scale: 0.6 },
			{ opacity: 1, scale: 1, duration: 0.8, ease: 'power1.out' },
			'+=0.2',
		)
		.fromTo($tags, { opacity: 0 }, { opacity: 1, stagger: 0.3 })
		.fromTo($actions, { opacity: 0 }, { opacity: 1, duration: 0.5 });
}

function inputTypeFile(input, label) {
	const inputFile = document.querySelector(input);
	const labelFile = document.querySelector(label);

	if (!inputFile || !labelFile) return;

	inputFile.addEventListener('change', (event) => {
		const file = event.target.files[0];

		labelFile.firstChild.textContent = file.name;
	});
}

function cancelPreventDefault(linksArr) {
	const links = document.querySelectorAll(linksArr);

	links.forEach((link) => {
		link.addEventListener('click', (e) => {
			return;
		});
	});
}

const videoLazyLoad = () => {
	const video = document.querySelector('.cover video');
	const img = document.querySelector('.cover__poster_image');

	if (!video) return;

	const source = video.querySelector('source[data-src]');

	const wrapVideo = source.closest('video');

	const src = source.dataset.src;
	source.src = src;

	wrapVideo.load();
	wrapVideo.style.opacity = 1;
	wrapVideo.play();
	img.style.opacity = 0;
};

function initMap() {
	const office = {
		lat: 53.29050661071361,
		lng: -6.132268920430111,
	};

	const map = new google.maps.Map(document.getElementById('js-google-map'), {
		zoom: 17.56,
		center: office,
	});

	new google.maps.Marker({
		position: office,
		map,
	});
}

function loadMapScript(mapSelector) {
	const map = document.getElementById(mapSelector);

	if (!map) return;

	const apiKey = map.getAttribute('data-api-key');

	if (!apiKey) return;

	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
	document.body.appendChild(script);
}

// const loadLottisJs = () => {
// 	let script = document.createElement('script');
// 	script.type = 'text/javascript';
// 	script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.8/lottie.min.js';
// 	document.body.appendChild(script);
// };

const isFunction = (func) => {
	return func instanceof Function;
};

const debounce = (delay, fn) => {
	let timerId;
	return (...args) => {
		if (timerId) {
			clearTimeout(timerId);
		}
		timerId = setTimeout(() => {
			fn(...args);
			timerId = null;
		}, delay);
	};
};

const onWindowResize = (cb) => {
	if (!cb && !isFunction(cb)) return;

	const handleResize = () => {
		cb();
	};

	window.addEventListener('resize', debounce(15, handleResize));

	handleResize();
};

const accordion = ({ triggersSelector, activeStateName }) => {
	const DEFAULT_CLASSES = {
		activeState: 'accordion__item--active-mod',
	};

	if (!triggersSelector) return;

	const $allTriggers = document.querySelectorAll(triggersSelector);
	const activeStateClass = activeStateName || DEFAULT_CLASSES.activeState;

	const closeAccordion = ({ $parentEl, $nextElementSibling, $trigger }) => {
		const $nextElemSibling = $nextElementSibling;
		$parentEl.classList.remove(activeStateClass);
		$nextElemSibling.style.maxHeight = null;
		$nextElementSibling.setAttribute('aria-hidden', 'true');
		$trigger.setAttribute('aria-expanded', 'false');
	};

	const closeAllAccordion = () => {
		$allTriggers.forEach(($item) => {
			closeAccordion({
				$parentEl: $item.parentNode,
				$nextElementSibling: $item.nextElementSibling,
				$trigger: $item,
			});
		});
	};

	const openAccordion = ({ $parentEl, $nextElementSibling, $trigger }) => {
		const $nextElemSibling = $nextElementSibling;
		const openAccordionDelay = 100;

		setTimeout(() => {
			closeAllAccordion();

			$parentEl.classList.add(activeStateClass);
			$nextElemSibling.style.maxHeight = $nextElementSibling.scrollHeight?.toString().concat('px');
			$nextElementSibling.removeAttribute('aria-hidden');
			$trigger.setAttribute('aria-expanded', 'true');
		}, openAccordionDelay);
	};

	const toggleAccordion = ($trigger) => {
		const accordionElements = {
			$parentEl: $trigger.parentNode,
			$nextElementSibling: $trigger.nextElementSibling,
			$trigger,
		};

		if (accordionElements.$parentEl.classList.contains(activeStateClass)) {
			closeAccordion(accordionElements);
		} else {
			openAccordion(accordionElements);
		}
	};

	$allTriggers.forEach(($item) => {
		$item.addEventListener('click', () => {
			toggleAccordion($item);
		});
	});

	onWindowResize(() => {
		$allTriggers.forEach(($item) => {
			const $parentEl = $item.parentNode;

			if (
				$parentEl.classList.contains(activeStateName) ||
				$parentEl.classList.contains(DEFAULT_CLASSES.activeState)
			) {
				const $nextElementSibling = $item.nextElementSibling;
				$nextElementSibling.style.maxHeight = $nextElementSibling.scrollHeight?.toString().concat('px');
			}
		});
	});
};

const hideBlock = (block) => {
	block.style.opacity = '0';
	block.style.visibility = 'hidden';
	block.style.pointerEvents = 'none';
};

const showBlock = (block) => {
	block.style.opacity = '1';
	block.style.visibility = 'visible';
	block.style.pointerEvents = 'all';
};

const isValidEmail = (email) => {
	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailPattern.test(email);
};

const isValidPhoneNumber = (phoneNumber) => {
	const phoneNumberPattern = /^\d+$/;
	return phoneNumberPattern.test(phoneNumber);
};

const contactFormSubmit = (contactFormParentSelector, contactFormSelector) => {
	const contactForm = document.querySelector(contactFormParentSelector);
	const contactFormBlock = document.querySelector(contactFormSelector);

	if (!contactFormBlock) return;

	const contactFormButton = contactFormBlock.querySelector('input[type=submit]');
	const contactSubmitBlock = document.querySelector('.contact__submit');
	const contactSubmitText = document.querySelector('.contact__submit p');
	const contactSpinner = document.querySelector('.contact__spinner');
	const lottieContainer = document.querySelector('.contact__image');

	let animation = null;

	contactFormButton.addEventListener('click', () => {
		const requiredFields = contactFormBlock.querySelectorAll('[aria-required="true"]');
		let hasEmptyRequiredFields = false;

		requiredFields.forEach((field) => {
			if (field.type === 'email') {
				if (!field.checkValidity() || field.value.trim() === '' || !isValidEmail(field.value)) {
					hasEmptyRequiredFields = true;
				}
			} else if (field.type === 'tel') {
				if (!field.checkValidity() || field.value.trim() === '' || !isValidPhoneNumber(field.value)) {
					hasEmptyRequiredFields = true;
				}
			} else {
				if (!field.checkValidity() || field.value.trim() === '') {
					hasEmptyRequiredFields = true;
				}
			}
		});

		if (!hasEmptyRequiredFields && contactSubmitBlock && contactSpinner) {
			hideBlock(contactForm);
			showBlock(contactSubmitBlock);
			showBlock(contactSpinner);
		}
	});

	contactFormBlock.addEventListener('wpcf7mailsent', (e) => {
		if (contactSpinner && lottieContainer && contactSubmitText) {
			hideBlock(contactSpinner);
			showBlock(contactSubmitText);
			showBlock(lottieContainer);
		}

		const lottieAnimationData = {
			v: '5.7.4',
			fr: 24,
			ip: 0,
			op: 48,
			w: 400,
			h: 400,
			nm: 'Comp 1',
			ddd: 0,
			assets: [],
			layers: [
				{
					ddd: 0,
					ind: 1,
					ty: 4,
					nm: 'Shape Layer 4',
					sr: 1,
					ks: {
						o: { a: 0, k: 100, ix: 11 },
						r: { a: 0, k: -90, ix: 10 },
						p: { a: 0, k: [186.304, 247.071, 0], ix: 2, l: 2 },
						a: { a: 0, k: [-121.196, -40.715, 0], ix: 1, l: 2 },
						s: { a: 0, k: [100, 106.667, 100], ix: 6, l: 2 },
					},
					ao: 0,
					shapes: [
						{
							ty: 'gr',
							it: [
								{
									ind: 0,
									ty: 'sh',
									ix: 1,
									ks: {
										a: 0,
										k: {
											i: [
												[0, 0],
												[0, 0],
											],
											o: [
												[0, 0],
												[0, 0],
											],
											v: [
												[-139.973, -77.811],
												[-10.634, 63.744],
											],
											c: false,
										},
										ix: 2,
									},
									nm: 'Path 1',
									mn: 'ADBE Vector Shape - Group',
									hd: false,
								},
								{
									ty: 'st',
									c: { a: 0, k: [0.3137254901960784, 0.7215686274509804, 0.2823529411764706, 1], ix: 3 },
									o: { a: 0, k: 100, ix: 4 },
									w: { a: 0, k: 15, ix: 5 },
									lc: 2,
									lj: 1,
									ml: 4,
									bm: 0,
									nm: 'Stroke 1',
									mn: 'ADBE Vector Graphic - Stroke',
									hd: false,
								},
								{
									ty: 'tr',
									p: { a: 0, k: [0, 0], ix: 2 },
									a: { a: 0, k: [0, 0], ix: 1 },
									s: { a: 0, k: [100, 100], ix: 3 },
									r: { a: 0, k: -4.055, ix: 6 },
									o: { a: 0, k: 100, ix: 7 },
									sk: { a: 0, k: 0, ix: 4 },
									sa: { a: 0, k: 0, ix: 5 },
									nm: 'Transform',
								},
							],
							nm: 'Shape 1',
							np: 3,
							cix: 2,
							bm: 0,
							ix: 1,
							mn: 'ADBE Vector Group',
							hd: false,
						},
						{
							ty: 'tm',
							s: { a: 0, k: 0, ix: 1 },
							e: {
								a: 1,
								k: [
									{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 30, s: [0] },
									{ t: 36, s: [100] },
								],
								ix: 2,
							},
							o: { a: 0, k: 0, ix: 3 },
							m: 1,
							ix: 2,
							nm: 'Trim Paths 1',
							mn: 'ADBE Vector Filter - Trim',
							hd: false,
						},
					],
					ip: 30,
					op: 48,
					st: 0,
					bm: 0,
				},
				{
					ddd: 0,
					ind: 2,
					ty: 4,
					nm: 'Shape Layer 2',
					sr: 1,
					ks: {
						o: { a: 0, k: 100, ix: 11 },
						r: { a: 0, k: 0, ix: 10 },
						p: {
							a: 1,
							k: [
								{
									i: { x: 0.667, y: 1 },
									o: { x: 0.333, y: 0 },
									t: 24,
									s: [62.804, 178.571, 0],
									to: [9.833, 9.5, 0],
									ti: [-9.833, -9.5, 0],
								},
								{ t: 30, s: [121.804, 235.571, 0] },
							],
							ix: 2,
							l: 2,
						},
						a: { a: 0, k: [-121.196, -40.715, 0], ix: 1, l: 2 },
						s: { a: 0, k: [100, 106.667, 100], ix: 6, l: 2 },
					},
					ao: 0,
					shapes: [
						{
							ty: 'gr',
							it: [
								{
									ind: 0,
									ty: 'sh',
									ix: 1,
									ks: {
										a: 0,
										k: {
											i: [
												[0, 0],
												[0, 0],
											],
											o: [
												[0, 0],
												[0, 0],
											],
											v: [
												[-143.513, -76.182],
												[-85.297, -14.387],
											],
											c: false,
										},
										ix: 2,
									},
									nm: 'Path 1',
									mn: 'ADBE Vector Shape - Group',
									hd: false,
								},
								{
									ty: 'st',
									c: { a: 0, k: [0.3137254901960784, 0.7215686274509804, 0.2823529411764706, 1], ix: 3 },
									o: { a: 0, k: 100, ix: 4 },
									w: { a: 0, k: 15, ix: 5 },
									lc: 2,
									lj: 1,
									ml: 4,
									bm: 0,
									nm: 'Stroke 1',
									mn: 'ADBE Vector Graphic - Stroke',
									hd: false,
								},
								{
									ty: 'tr',
									p: { a: 0, k: [0, 0], ix: 2 },
									a: { a: 0, k: [0, 0], ix: 1 },
									s: { a: 0, k: [100, 100], ix: 3 },
									r: { a: 0, k: -4.055, ix: 6 },
									o: { a: 0, k: 100, ix: 7 },
									sk: { a: 0, k: 0, ix: 4 },
									sa: { a: 0, k: 0, ix: 5 },
									nm: 'Transform',
								},
							],
							nm: 'Shape 1',
							np: 3,
							cix: 2,
							bm: 0,
							ix: 1,
							mn: 'ADBE Vector Group',
							hd: false,
						},
						{
							ty: 'tm',
							s: { a: 0, k: 0, ix: 1 },
							e: {
								a: 1,
								k: [
									{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 24, s: [15] },
									{ t: 30, s: [100] },
								],
								ix: 2,
							},
							o: { a: 0, k: 0, ix: 3 },
							m: 1,
							ix: 2,
							nm: 'Trim Paths 1',
							mn: 'ADBE Vector Filter - Trim',
							hd: false,
						},
					],
					ip: 24,
					op: 48,
					st: 0,
					bm: 0,
				},
				{
					ddd: 0,
					ind: 3,
					ty: 4,
					nm: 'Shape Layer 1',
					sr: 1,
					ks: {
						o: { a: 0, k: 100, ix: 11 },
						r: { a: 0, k: -71, ix: 10 },
						p: { a: 0, k: [200, 200, 0], ix: 2, l: 2 },
						a: { a: 0, k: [22.5, 11.5, 0], ix: 1, l: 2 },
						s: { a: 0, k: [102.786, 102.786, 100], ix: 6, l: 2 },
					},
					ao: 0,
					shapes: [
						{
							ty: 'gr',
							it: [
								{
									d: 1,
									ty: 'el',
									s: { a: 0, k: [359, 359], ix: 2 },
									p: { a: 0, k: [0, 0], ix: 3 },
									nm: 'Ellipse Path 1',
									mn: 'ADBE Vector Shape - Ellipse',
									hd: false,
								},
								{
									ty: 'st',
									c: { a: 0, k: [0.3137254901960784, 0.7215686274509804, 0.2823529411764706, 1], ix: 3 },
									o: { a: 0, k: 100, ix: 4 },
									w: { a: 0, k: 15, ix: 5 },
									lc: 2,
									lj: 1,
									ml: 4,
									bm: 0,
									nm: 'Stroke 1',
									mn: 'ADBE Vector Graphic - Stroke',
									hd: false,
								},
								{
									ty: 'tr',
									p: { a: 0, k: [22.5, 11.5], ix: 2 },
									a: { a: 0, k: [0, 0], ix: 1 },
									s: { a: 0, k: [100, 100], ix: 3 },
									r: { a: 0, k: 0, ix: 6 },
									o: { a: 0, k: 100, ix: 7 },
									sk: { a: 0, k: 0, ix: 4 },
									sa: { a: 0, k: 0, ix: 5 },
									nm: 'Transform',
								},
							],
							nm: 'Ellipse 1',
							np: 3,
							cix: 2,
							bm: 0,
							ix: 1,
							mn: 'ADBE Vector Group',
							hd: false,
						},
						{
							ty: 'tm',
							s: {
								a: 1,
								k: [
									{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 4, s: [100] },
									{ t: 24, s: [0] },
								],
								ix: 1,
							},
							e: { a: 0, k: 100, ix: 2 },
							o: { a: 0, k: 0, ix: 3 },
							m: 1,
							ix: 2,
							nm: 'Trim Paths 1',
							mn: 'ADBE Vector Filter - Trim',
							hd: false,
						},
					],
					ip: 0,
					op: 48,
					st: 4,
					bm: 0,
				},
			],
			markers: [],
		};

		animation = lottie.loadAnimation({
			container: lottieContainer,
			renderer: 'svg',
			loop: false,
			autoplay: true,
			animationData: lottieAnimationData,
			rendererSettings: {
				forceOverlay: true,
			},
		});

		setTimeout(() => {
			showBlock(contactForm);
			hideBlock(contactSubmitBlock);
			hideBlock(contactSubmitText);
			hideBlock(lottieContainer);
			animation.destroy();
		}, 4000);
	});
};

const imgLazyLoad = () => {
	const images = document.querySelectorAll('img[data-src]');

	console.log(images);

	if (!images.length) return;

	setTimeout(() => {
		images.forEach((el) => {
			const { src } = el.dataset;
			el.src = src;
		});
	}, 50);
};

window.addEventListener('load', () => {
	console.log('custom disable form');
	document.body.classList.add('body--loaded');
	// loadLottisJs();
	// contactFormSubmit('.contact__form_content', '.contact__form_content form');
	// contactFormSubmit('.popup_form__content .wpcf7', '.popup_form__content form');
	loadMapScript('js-google-map');
	setTimeout(() => {
		videoLazyLoad();
	}, 3500);
	imgLazyLoad();
});

window.matchMedia('(orientation: portrait)').addEventListener('change', () => {
	calcViewportHeight();
});
accordion({
	triggersSelector: '.js-accordion-head',
	activeStateName: 'content_accordion__item--active-mod',
});
calcViewportHeight();
heroAnimation();
popupShow('.popup_open', '.popup_form__close', '.popup_form');
scrollTo('.scroll_anchor', '.packages');
// inputTypeFile('.popup_form__label input[type=file]', '.popup_form__label')
// cancelPreventDefault('.packages .button.button_light')
