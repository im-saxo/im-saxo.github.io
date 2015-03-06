(function ($) {
	var $window = $(window),
		$body = $(document.body);

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



	// STEP 0
	function ZeroStep (id) {
		this.setEl(id);
		this.$go = this.$('.js-go');
		this.$go.bind('click', function () {
			Controller.nextStep();
		})
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
					1: new ChooseColor(1)
				};

				this.currentStep = 1; // TODO 0
				this.setStep(1); // TODO 0
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