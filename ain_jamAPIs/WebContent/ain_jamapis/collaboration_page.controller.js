
sap.ui.controller("ain_jamapis.collaboration_page", {

	collaborationPage_securityLevel : undefined,
	
//	collaborationPage : undefined,

	onInit: function() {
		this.bindDataToCollaboration();
	},

	onPressOpenAddParticipantDialog: function(oEvent){
		this.add = "GroupUnavailable";
		this.openAddParticipantDialog();
	},

	openAddParticipantDialog : function(){
		if(this.addParticipantsDialog == undefined){
			this.addParticipantsDialog = sap.ui.xmlfragment("addParticipant","fragments.addParticipant",this);
			this.getView().addDependent(this.addParticipantsDialog);
		}
		this.addParticipantsDialog.open();
	},
	
	bindDataToCollaboration : function(){
		this.collaborationPage_securityLevel = [];
		var securityLevelNames = [{level_key:"public_internal",level_name:"public"},{level_key:"private_internal",level_name:"private"},{level_key:"private_external",level_name:"external"}];
		var securityLevelData;

		for(var index = 0; index < securityLevelNames.length; index++){
			var security_Levels = {};
			security_Levels.levelKey = securityLevelNames[index].level_key;
			security_Levels.levelName = securityLevelNames[index].level_name;
			this.collaborationPage_securityLevel.push(security_Levels);
		}
		
		

		var oModel_collaborationPage = new sap.ui.model.json.JSONModel();
		oModel_collaborationPage.setData({securityLevelData : this.collaborationPage_securityLevel});
		this.byId("securityLevelActionSelect").setModel(oModel_collaborationPage);
	},

	onPressCreateGroup : function(oEvent){
		/*
		var GroupJson = {
				"Name":"AIN_PROTOTYPE_TEST_4",
				"Description":"test",
				"GroupType":"public_internal"
		};*/
		var groupName = this.byId("groupName").getValue();
		var groupDescription = this.byId("groupDescription").getValue();
		var groupType = this.byId("securityLevelActionSelect").getSelectedKey();
		
		var GroupJson = {};
		GroupJson.Name = groupName;
		GroupJson.Description = groupDescription;
		GroupJson.GroupType = groupType;
		
	//	this.GroupModel = new sap.ui.model.json.JSONModel(GroupJson);
		var oModel = new sap.ui.model.odata.ODataModel("https://ldcier3.wdf.sap.corp:44333/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData?sap-client=003"); //"ranjithkuma", "Saplabs123"
		oModel.create('/Groups',GroupJson, null, function(oData){
			alert("Create successful");
		},function(oError){
			alert("Create failed");});
	},
	
	onPressSendInvitation : function(oEvent){
		/*var inviteMemberModel = {
				"Name":"Deepshikha Mohanta",
				"Email":"deepshikha.mohanta@sap.com"
		};*/
		
		var memberName = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("addParticipant","memberName")).getValue();
		var memberEmailId = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("addParticipant","memberEmailId")).getValue();
		var groupIDValue;
		var inviteMemberModel = {};
		inviteMemberModel.Name = memberName;
		inviteMemberModel.Email = memberEmailId;
		
		
		//var invite_member_path = "/Group_Invite?Id='"+ "VnldUaakyb2imosCyg0qef" +"'&Email='"+"deepshikha.mohanta@sap.com"+"'&Message='Please join this group'";
		if(this.add == "GroupAvailable"){
			groupIDValue = oController.groupId;
		}
		else if(this.add = "GroupUnavailable"){
			groupIDValue = "FaqoOF7G9tj461DgHACFLy";
		}
		var invite_member_path = "/Group_Invite?Id='"+groupIDValue+"'&Email='"+memberEmailId+"'&Message='Please join this group'";
		var oModel = new sap.ui.model.odata.ODataModel("https://ldcier3.wdf.sap.corp:44333/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData?sap-client=003");
		oModel.create(invite_member_path, inviteMemberModel, null, function(oData){
   	     alert("Successfuly Invited");
    	   },function(oError){
    	    alert("Invite failed");});
	//	this.addParticipantsDialog.close();
	},

	onPressGetAllGroups : function(oEvent){
		oController = this.getView().getController();
		var oModel = new sap.ui.model.odata.ODataModel("https://ldcier3.wdf.sap.corp:44333/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData?sap-client=003"); //"ranjithkuma", "Saplabs123"
		oModel.read('/Groups', null, null, true, function(oData, oResponse){
	 	//	alert("Read successful: " + JSON.stringify(oData));
			oController.groupsJSON ={
					groups :oData.results
			}
			if(oController.groupsModel === undefined){
				oController.groupsModel = new sap.ui.model.json.JSONModel();
			}
		
			oController.groupsModel.setData(oController.groupsJSON);
			oController.groupsModel.checkUpdate();
	 		
			if(oController.allGroupsDialog == undefined){
				oController.allGroupsDialog = sap.ui.xmlfragment("allGroups","fragments.allGroups",oController);
				oController.allGroupsDialog.setModel(oController.groupsModel);
				oController.getView().addDependent(oController.allGroupsDialog);
			}
			
			oController.allGroupsDialog.open();
	 	},function(){
			alert("Read failed");});
	},
	

	onSelectOpenGroupActionsDialog : function(oEvent){
		oController.groupId = oEvent.getParameter("listItem").getBindingContext().getObject().Id;
		if(this.optionsForActionOnGroupDialog == undefined){
			this.optionsForActionOnGroupDialog = sap.ui.xmlfragment("optionsForActionOnGroup","fragments.optionsForActionOnGroup",this);
			this.getView().addDependent(this.optionsForActionOnGroupDialog);
		}
		this.optionsForActionOnGroupDialog.open();
	},
	
	
	onPressShowListOfFeedEntries : function(oEvent){
		var feedEntriespath = "/Groups('"+oController.groupId+"')/FeedEntries";
		var oModel = new sap.ui.model.odata.ODataModel("https://ldcier3.wdf.sap.corp:44333/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData?sap-client=003"); //"ranjithkuma", "Saplabs123"
		
	       oModel.read(feedEntriespath, null, null, true, function(oData, oResponse){ 
	        	//alert("Read feed entries successful: " + JSON.stringify(oData)); 
	   			oController.feedEntriesJSON ={
	   					feedEntries :oData.results
	   			}
	   			if(oController.feedEntriesModel === undefined){
	   				oController.feedEntriesModel = new sap.ui.model.json.JSONModel();
	   			}
	   		
	   			oController.feedEntriesModel.setData(oController.feedEntriesJSON);
	   			oController.feedEntriesModel.checkUpdate();
	   	 		
	   			if(oController.feedEntriesDialog == undefined){
	   				oController.feedEntriesDialog = sap.ui.xmlfragment("feedEntries","fragments.feedEntries",oController);
	   				oController.feedEntriesDialog.setModel(oController.feedEntriesModel);
	   				oController.getView().addDependent(oController.feedEntriesDialog);
	   			}
	   			
	   			oController.feedEntriesDialog.open();
	   	 	
	    	   
	         },function(){ 
	              alert("Read feed entries failed");
	         });
	},
	
	
	onPressShowListOfMembers : function(oEvent){
		var oModel = new sap.ui.model.odata.ODataModel("https://ldcier3.wdf.sap.corp:44333/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData?sap-client=003"); //"ranjithkuma", "Saplabs123"
		var groupMembersPath = "/Groups('"+oController.groupId+"')/Memberships"; 
	     oModel.read(groupMembersPath, null, null, true, function(oData, oResponse){ 
	        //	alert("Read successful: " + JSON.stringify(oData)); 
	        	oController.membersData = oData.results;
	        	oController.getListOfMembers();
	      
	         },function(){ 
	              alert("Read failed");
	         });
    			
    		
		
	},
	
	getListOfMembers : function(){
		oController.membersList = [];
	  	if(oController.membersData!= undefined && oController.membersData.length > 0){
	  		var listOfMembers;
	  		var oModel = new sap.ui.model.odata.ODataModel("https://ldcier3.wdf.sap.corp:44333/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData?sap-client=003"); //"ranjithkuma", "Saplabs123"
			
			for(var index = 0; index < oController.membersData.length; index++){
				
				 var memberDetailsPath = "/Members('"+oController.membersData[index].MemberId+"')";
				 oModel.read(memberDetailsPath, null, null, false, function(oData, oResponse){ 
			        	//alert("Read members successful: " + JSON.stringify(oData));
					 var memberObject = {};
					 memberObject.fullName = oData.FullName;
					 memberObject.email = oData.Email;
					 oController.membersList.push(memberObject);
				
				 },function(){ 
			              alert("Read members failed");
			         });
				
				 
			}
			 
			if(oController.membersListModel === undefined){
				oController.membersListModel = new sap.ui.model.json.JSONModel();
			}
	
		oController.membersListModel.setData({listOfMembers : oController.membersList});
			oController.membersListModel.checkUpdate();
			
			if(oController.listOfMembersDialog == undefined){
   				oController.listOfMembersDialog = sap.ui.xmlfragment("listOfMembers","fragments.listOfMembers",oController);
   				oController.listOfMembersDialog.setModel(oController.membersListModel);
   				oController.getView().addDependent(oController.listOfMembersDialog);
   			}
   			
   			oController.listOfMembersDialog.open();
	}
},

	onPressOpenInviteMembersDialog : function(oEvent){
		this.add = "GroupAvailable";
		this.openAddParticipantDialog();
	},
	
	onPressHandleClose : function(oEvent){
		oEvent.getSource().getParent().close();
	},
	
	onSelectOpenPossibleActionsOnFeeds : function(oEvent){
		oController.feedId = oEvent.getParameter("listItem").getBindingContext().getObject().Id;
		if(this.optionsForActionOnFeedDialog == undefined){
			this.optionsForActionOnFeedDialog = sap.ui.xmlfragment("feedActions","fragments.feedActions",this);
			this.getView().addDependent(this.optionsForActionOnFeedDialog);
		}
		this.optionsForActionOnFeedDialog.open();
	},
	
	onPressShowReplies : function(oEvent){
		var replyEntriespath = "/FeedEntries('"+oController.feedId+"')/Replies";
		var oModel = new sap.ui.model.odata.ODataModel("https://ldcier3.wdf.sap.corp:44333/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData?sap-client=003"); //"ranjithkuma", "Saplabs123"
		 oModel.read(replyEntriespath, null, null, false, function(oData, oResponse){ 
	       // alert("Read feed replies successful: " + JSON.stringify(oData));
			 oController.replyEntriesJSON ={
	   					replyEntries :oData.results
	   			}
	   			if(oController.replyEntriesModel === undefined){
	   				oController.replyEntriesModel = new sap.ui.model.json.JSONModel();
	   			}
	   		
	   			oController.replyEntriesModel.setData(oController.replyEntriesJSON);
	   			oController.replyEntriesModel.checkUpdate();
	   	 		
	   			if(oController.replyEntriesDialog == undefined){
	   				oController.replyEntriesDialog = sap.ui.xmlfragment("replyEntries","fragments.listOfReplies",oController);
	   				oController.replyEntriesDialog.setModel(oController.replyEntriesModel);
	   				oController.getView().addDependent(oController.replyEntriesDialog);
	   			}
	   			
	   			oController.replyEntriesDialog.open();
		
		 },function(){ 
	              alert("Read replies failed");
	         });
	},
	
	onExit: function() {
		if(this.addParticipantsDialog != undefined){
			this.addParticipantsDialog.destroy();
		}
		if(this.allGroupsDialog != undefined){
			this.allGroupsDialog.destroy();
		}
		if(oController.feedEntriesDialog != undefined){
			oController.feedEntriesDialog.destroy();
		}
		if(oController.listOfMembersDialog != undefined){
			oController.listOfMembersDialog.destroy();
		}
		if(oController.optionsForActionOnGroupDialog != undefined){
			oController.optionsForActionOnGroupDialog.destroy();
		}
		
	}

});