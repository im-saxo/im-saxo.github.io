(function ($) {
	// step 0
	function ZeroStep () {
		this.$go = $('.js-go');
		this.$go.bind('click', function () {
			Controller.nextStep();
		})
	}

	ZeroStep.prototype = {
		constructor: ZeroStep,

		show: function () {
		}
	};

	// navigation
	$(function() {
		var Controller = {
			stepController: {},
			currentStep: 0,

			init: function ()
			{
				this.stepController = {
					0: new ZeroStep()
				};

				this.currentStep = 0;
				this.setStep(0);
			},

			setStep: function (id) {
				this.currentStep = id;
				$('.step').hide();
				$('#step-' + id).fadeIn();
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

		Controller.init();
	});
})(jQuery);