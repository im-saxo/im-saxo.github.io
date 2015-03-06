(function ($) {
	var $window = $(window),
		$body = $(document.body);

	var quizQuestions = [
		{
			question: "Зачем советским дворникам укоротили метлы?",
			answers: [
				{text: "Чтоб не улетали в Хогвартс", correct: false},
				{text: "Чтоб не стояли без дела, опираясь на метлы", correct: true},
				{text: "Чтоб было больше места в подсобке", correct: false}
			]
		},
		{
			question: "Согласно детскому определению, американец - это человек с двумя руками и четырьмя... Чем?",
			answers: [
				{text: "Ногами", correct: false},
				{text: "Кошельками", correct: false},
				{text: "Колесами", correct: true}
			]
		},
		{
			question: "Что больше весит -  1кг ваты или 1кг железа?",
			answers: [
				{text: "Вата", correct: false},
				{text: "Железо", correct: false},
				{text: "2кг темной материи", correct: true}
			]
		},
		{
			question: "Какая из перечисленных ниже формул имеет прямое отношение к теории относительности?",
			answers: [
				{text: "Формула 1", correct: false},
				{text: "E = mc2", correct: true},
				{text: "Коммунизм = советская власть + электрификация всей страны", correct: false},
				{text: "Всё в мире относительно, так что с какой стороны посмотреть", correct: false}
			]
		},
		{
			question: "Отгадайте загадку: 'без окон, без дверей, полна горна людей'?",
			answers: [
				{text: "Не знаю точно, но похоже на какой-то овощ с большим количеством семян ", correct: true},
				{text: "Следственный изолятор", correct: false},
				{text: "МКС во время визита космических туристов", correct: false},
				{text: "Банка килек в томате", correct: false}
			]
		}
	];

	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	function blink (correct, callback) {
		var $content = $('.content');
			$content.css('background-color', correct ? '#B0F489' : '#F48989');
			setTimeout(function () {
				$content.css('background-color', '');
				if (callback) {
					callback();
				}
			}, 400);
	}

	// VIEW
	function BaseView () {}

	BaseView.prototype = {
		constructor: BaseView,

		show: function () {
			this.active = true;
			this.$el.fadeIn();
		},

		hide: function () {
			this.active = false;
		},

		setEl: function (id) {
			this.$el = $('#step-' + id)
		},

		$: function (selector) {
			return this.$el.find(selector);
		},

		destroy: function () {
		}
	};

	function extendView(Child, extend) {
		var Parent = function () {};
		Parent.prototype = BaseView.prototype;
		Child.prototype = new Parent();
		Child.prototype.constructor = Child;

		for (var k in extend) {
			if (extend.hasOwnProperty(k)) {
				Child.prototype[k] = extend[k];
			}
		}
	}



	// STEP 0, 2
	function ZeroStep (id) {
		this.setEl(id);
		this.$go = this.$('.js-go');
		this.$go.bind('click', function () {
			Controller.nextStep();
		});
	}

	extendView(ZeroStep, {
		destroy: function () {
			this.$go.unbind('click');
			this.$go = null;
		}
	});



	// STEP 1
	function ChooseColor (id) {
		this.setEl(id);
		this.$('.js-card').bind('click', this.setColor.bind(this))
	}

	extendView(ChooseColor, {
		setColor: function (evt) {
			var $card = $(evt.currentTarget),
				color = $card.attr('data-color'),
				$clone = $card.clone();

			$clone.css({
				'position': 'absolute',
				'width': $card.width() + 'px',
				'height': $card.height() + 'px',
				'top': $card.offset().top,
				'left': $card.offset().left
			});
			$body.append($clone);

			$clone.animate({
				left: 0,
				top: 0,
				width: $window.width(),
				height: $window.height()
			}, 'fast', function () {
				$body.addClass(color);
				$clone.remove();
				Controller.nextStep();
			}.bind(this))

		},

		destroy: function (evt) {
			this.$('.js-card').unbind('click');
		}
	});



	// STEP 3
	function ChoosePicture (id, rotate) {
		this.setEl(id);

		this.$success = this.$('.js-success');
		this.$go = this.$('.js-go').bind('click', function () {
			Controller.nextStep();
		});
		
		this.$images = this.$('.js-image');
		this.initImages(this.$images, rotate);
		this.$images.bind('click', this.onCLick.bind(this))

	}

	extendView(ChoosePicture, {
		initImages: function ($images, rotate) {
			var names = shuffle(['1', '2', '3', '4']),
				degrees = {
					"1": "0",
					"2": "90deg",
					"3": "180deg",
					"4": "270deg"
				}
				path = '/quest/images/',
				i = 0, l = names.length;

			for (i; i < l; i++) {
				$($images[i])
					.attr('data-image', '' + names[i])
					.css(!rotate ? {'background-image': "url('" + path + names[i] + ".jpg')"} : 
						{
							'-webkit-transform': 'rotate(' + degrees[names[i]] + ')',
							'-moz-transform': 'rotate(' + degrees[names[i]] + ')',
							'transform': 'rotate(' + degrees[names[i]] + ')',
						});
			}

		},

		onCLick: function (evt) {
			var $image = $(evt.currentTarget);
			if ($image.attr('data-image') == '1') {
				blink(true, this.$success.show);
			}
			else {
				blink(false);
			}

		},


		destroy: function () {
			this.$go.unbind('click');
			this.$images.unbind('click');
			this.$success.hide();
		}
	});


	function Quiz (id) {
		this.setEl(id);
		this.qurrentQuestion = 0;
		this.totalQuestions = 3;
		shuffle(quizQuestions);

		this.$info = this.$('.js-info');
		this.$content = this.$('.js-content');
		this.$question = this.$('.js-question');
		this.$answers = this.$('.js-answers');
		this.$go = this.$('.js-go');
		this.$go.bind('click', this.begin.bind(this));
	}

	extendView(Quiz, {
		begin: function () {
			this.$info.hide();
			this.$content.fadeIn();

			this.$go
				.text('Я молодец!')
				.unbind('click')
				.bind('click', function () {
					Controller.nextStep();
				});

			this.nextQuestion();
		},

		nextQuestion: function () {
			if (this.qurrentQuestion < this.totalQuestions) {
				var quiz = quizQuestions[this.qurrentQuestion],
					answer,
					$html;

				this.$question.text(quiz.question);
				this.getRadio().unbind('change');
				this.$answers.empty();
				for (var i = 0, l = quiz.answers.length; i < l; i++) {
					answer = quiz.answers[i];
					$html = $('<div><label><input type="radio" name="quiz" value="' + (answer.correct ? 1 : 0) + '"/>' + answer.text + '</label></div>');
					this.$answers.append($html);
				}
				this.getRadio().bind('change', this.check.bind(this));
				this.qurrentQuestion++;
			}
			else {
				this.$content.hide();
				this.$info.show();
			}
		},

		getRadio: function () {
			return this.$answers.find('input[type="radio"][name="quiz"]');
		},

		check: function (evt) {
			if (evt.target.value == "1") {
				blink(true, this.nextQuestion.bind(this));
			}
			else {
				blink(false);
			}
		},

		destroy: function () {
			this.$go.text('Окей, где вопросы?').unbind('click');
			this.$content.hide();
			this.$info.show();
			this.qurrentQuestion = 0;
		}
	});



	// NAVIGATION
	$(function() {
		var Controller = {
			stepController: {},
			currentStep: 0,

			init: function ()
			{
				for (var k in this.stepController) {
					if (this.stepController.hasOwnProperty(k)) {
						this.stepController[k].destroy();
					}
				}
				$body.removeClass();

				this.stepController = {
					0: new ZeroStep(0),
					1: new ChooseColor(1),
					2: new ZeroStep(2),
					3: new ChoosePicture(3),
					4: new ChoosePicture(4, true),
					5: new Quiz(5)
				};

				this.currentStep = 5; // TODO 0
				this.setStep(5); // TODO 0
			},

			setStep: function (id) {
				// hide prev
				this.stepController[this.currentStep] && this.stepController[this.currentStep].hide();
				$('.step').hide();
				// show new
				this.currentStep = id;
				this.stepController[id] && this.stepController[id].show();
			},

			nextStep: function () {
				this.setStep(this.currentStep + 1);
			}
		};

		// Export
		window.Controller = Controller;



		$('.js-restart').bind('click', function (evt) {
			if (window.confirm('Начать сначала?')) {
				Controller.init();
			}
		});

		var $head = $('.head'),
			$content = $('.content'),
			padding = 1 * $content.css('padding-top').slice(0, -2) + 1 * $content.css('padding-bottom').slice(0, -2);

		$window.bind('resize', function (evt) {
			$content.css('min-height', $window.height() - padding - $content.offset().top - 5);
		});

		$window.triggerHandler('resize');


		Controller.init();
	});
})(jQuery);