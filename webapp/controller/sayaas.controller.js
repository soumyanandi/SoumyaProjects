sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("com.sap.soumyaSentimentAnalysisYaas.controller.sayaas", {
		/**
		 *@memberOf com.sap.soumyaSentimentAnalysisYaas.controller.sayaas
		 */
		onInit: function() {
			// this.byId("idSentimentEntityTable").setVisible(false);
			this.byId("idTable").setVisible(false);
			console.log("Sentiment and Entity tables are disabled initially from the screen");
		},

		/**
		 *The bellow function will be called on press of the button Analyze
		 */
		onPressAnalyze: function() {
			//This code was generated by the layout editor.

			console.log("Entering method: onPressAnalyze");

			var view = this.getView();
			var method = "onPressAnalyze";

			var input = view.byId("idinputfield").getValue();
			console.log("Value recieved from the input field: " + input);

			if (input !== "" || input !== null) {
				//Calling a function to get the authorization token for sentiment analysis
				this.getAuthenticationToken(input, method);
				console.log("Exiting method: onPressAnalyze");
			} else {
				MessageToast.show("Please enter some input before you analyze it");
				console.log("Please enter some input before you analyze it");
			}
		},

		onPressExtract: function() {
			//This code was generated by the layout editor.

			console.log("Entering method: onPressExtract");

			var view = this.getView();
			var method = "onPressExtract";

			var input = view.byId("idinputfield").getValue();
			console.log("Value recieved from the input field: " + input);

			if (input !== "" || input !== null) {
				//Calling a function to get the authorization token for sentiment analysis
				this.getAuthenticationToken(input, method);
				console.log("Exiting method: onPressExtract");
			} else {
				MessageToast.show("Please enter some input before you analyze it");
				console.log("Please enter some input before you analyze it");
			}
		},

		getAuthenticationToken: function(input, method) {
			console.log("Entering method: getAuthenticationToken");

			//Taking reference of global this variable
			var that = this;

			var xhr = new XMLHttpRequest();

			xhr.addEventListener("readystatechange", function() {
				if (this.readyState === 4) {
					if (this.status === 200) {
						console.log("Post call of auth token is successfully completed");

						var response = JSON.parse(this.responseText);

						that.getView().getModel("response").setProperty("/authType", response.token_type);
						that.getView().getModel("response").setProperty("/authCode", response.access_token);
						console.log("Token type: " + response.token_type);
						console.log("Authorization code: " + response.access_token);
						console.log("Value of token type and auth code successfully set to the model data");

						//calling function for the Sentiment Analysis/Entity Extraction for the details entered into the input field 
						//based on the button pressed
						if (method === "onPressAnalyze") {
							console.log("Called the method to get the Sentiment Analysis");
							that.sentimentAnalysis(input);
						} else if (method === "onPressExtract") {
							console.log("Called the method to get the Entity Extraction");
							that.entityExtraction(input);
						}

						console.log("Exiting method: getAuthenticationToken");
					} else {
						MessageToast.show("Error in getting authorization token: " + this.responseText);
						console.log("Error in getting authorization token: " + this.responseText);
					}
				}
			});

			xhr.open("POST", this.getView().getModel("response").getProperty("/oUrl"));
			xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

			xhr.send(this.getView().getModel("response").getProperty("/authBody"));
			console.log("After making the post call of auth token");
		},

		sentimentAnalysis: function(input) {
			console.log("Entering method: sentimentAnalysis");
			//Taking reference of global this variable
			var that = this;
			
			
			
			var xhr = new XMLHttpRequest();

			xhr.addEventListener("readystatechange", function() {
				if (this.readyState === 4) {
					if (this.status === 200) {
						console.log("Post call of sentiment analysis is successfully completed");

						var response = JSON.parse(this.responseText);

						// set the response as JSON in the demo model
						that.getView().getModel("response").setProperty("/entities", response.entities);
						console.log("Set the response of sentiment analysis to the model data");

						// display the result table
						that.byId("idTable").setVisible(true);
						that.getView().getModel("response").setProperty("/tablelabel", "Sentiment Analysis");//added dynamic heading to the table
						console.log("Enabled the table to display the result of sentiment analysis");

						//set the model for the UI5 table to populate product classification results
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(that.getView().getModel("response").oData);
						that.getView().setModel(oModel);
						console.log("Set the model data to the table to display the sentiment analysis result in the table");

						console.log("Exiting method: sentimentAnalysis");
					} else {
						MessageToast.show("Error in getting sentiment analysis: " + this.responseText);
						console.log("Error in getting sentiment analysis: " + this.responseText);
					}
				}
			});

			xhr.open("POST", this.getView().getModel("response").getProperty("/sUrl"));
			xhr.setRequestHeader("content-type", "application/octet-stream");
			xhr.setRequestHeader("Authorization", this.getView().getModel("response").getProperty("/authType") + " " + this.getView().getModel(
				"response").getProperty("/authCode"));

			xhr.send(input);
			console.log("After making the post call of Sentiment Analysis Yaas Service");
		},

		entityExtraction: function(input) {
			console.log("Entering method: entityExtraction");
			//Taking reference of global this variable
			var that = this;

			this.getView().getModel("response").setProperty("/tablelabel", "Entity Extraction");
			var xhr = new XMLHttpRequest();

			xhr.addEventListener("readystatechange", function() {
				if (this.readyState === 4) {
					if (this.status === 200) {
						console.log("Post call of Entity Extraction is successfully completed");

						var response = JSON.parse(this.responseText);

						// set the response as JSON in the demo model
						that.getView().getModel("response").setProperty("/entities", response.entities);
						console.log("Set the response of entity extraction to the model data");

						// display the result table
						that.byId("idTable").setVisible(true);
						that.getView().getModel("response").setProperty("/tablelabel", "Entity Extraction");//added dynamic heading to the table
						console.log("Enabled the table to display the result of entity extraction");

						//set the model for the UI5 table to populate product classification results
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(that.getView().getModel("response").oData);
						that.getView().setModel(oModel);
						console.log("Set the model data to the table to display the entity extraction result in the table");

						console.log("Exiting method: entityExtraction");
					} else {
						MessageToast.show("Error in getting entity extraction: " + this.responseText);
						console.log("Error in getting entity extraction: " + this.responseText);
					}
				}
			});

			xhr.open("POST", this.getView().getModel("response").getProperty("/eUrl"));
			xhr.setRequestHeader("content-type", "application/octet-stream");
			xhr.setRequestHeader("Authorization", this.getView().getModel("response").getProperty("/authType") + " " + this.getView().getModel(
				"response").getProperty("/authCode"));

			xhr.send(input);
			console.log("After making the post call of Entity Extraction Yaas Service");
		}
	});
});