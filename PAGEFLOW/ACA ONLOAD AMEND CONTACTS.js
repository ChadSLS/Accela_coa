/*------------------------------------------------------------------------------------------------------/
| Program : ACA LOAD AMENDMENT ADDRESS.js
| 
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;						// Set to true to see results in popup window
var showDebug = false;							// Set to true to see debug messages in popup window
var useAppSpecificGroupName = false;			// Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;			// Use Group name when populating Task Specific Info Values
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message =	"";							// Message String
var debug = "";								// Debug String
var br = "<BR>";							// Break Tag
var useProductScripts = true;

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}


eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,true));
eval(getScriptText("INCLUDES_CUSTOM",null,true)); 

var cap = aa.env.getValue("CapModel"); 
parentId = null;
parentCapIdString = "" + cap.getParentCapID();
if (parentCapIdString) {
	pca = parentCapIdString .split("-");
	parentId = aa.cap.getCapID(pca[0],pca[1],pca[2]).getOutput();
}
if (parentId) {
	parentCap = aa.cap.getCapViewBySingle4ACA(parentId);
}
if (parentCap) {
	contactList = parentCap.getContactsGroup();
	for (i = 0; i < contactList.size(); i++) {
		contactList.get(i).getPeople().setContactSeqNumber(null);
		contactList.get(i).setComponentName(null);
	}
	cap.setContactsGroup(contactList);
	aa.env.setValue("CapModel", cap)
}

	
if (debug.indexOf("**ERROR") > 0)
	{
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
	}
else
	{
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage) aa.env.setValue("ScriptReturnMessage", message);
	if (showDebug) 	aa.env.setValue("ScriptReturnMessage", debug);
	}