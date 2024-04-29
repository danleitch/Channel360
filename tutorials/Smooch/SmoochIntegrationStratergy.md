### Step 1.

Channel360 Creates a Smooch App, when an Organization is created.

with the following endpoint.

> https://api.smooch.io/v2/apps


#### Request.

```json
{
  "displayName": "<org-name>",
  "settings": {
    "conversationRetentionSeconds": 4519554,
    "maskCreditCardNumbers": false,
    "useAnimalNames": false,
    "echoPostback": false,
    "ignoreAutoConversationStart": true,
    "multiConvoEnabled": true,
    "attachmentsAccess": "public",
    "attachmentsTokenExpirationSeconds": 64028
  },
  "metadata": {
    "lang": "en-ca"
  }
}
```

#### Response.

```json
{
  "app": {
    "settings": {
      "maskCreditCardNumbers": false,
      "useAnimalNames": false,
      "conversationRetentionSeconds": 4519554,
      "echoPostback": false,
      "ignoreAutoConversationStart": true,
      "multiConvoEnabled": true,
      "attachmentsAccess": "public",
      "attachmentsTokenExpirationSeconds": 64028
    },
    "metadata": {
      "lang": "en-ca"
    },
    "id": "<app-id>",
    "displayName": "<org-name>"
  }
}
```

------

### Step 2.

Clients will need to fill out a form on Channel360, that mocks the Whatsapp Approval Form on Smooch. 

Channel360, will then take the data from that client and manually send an approval request to Smooch. 

Smooch will then  automatically add a Whatsapp Integration into the Client's App. 

[Link to ChannelMobile Whatsapp Approval Form](https://www.channelmobile.co.za/whatsapp-business-registration)
<br/>
[Link To Smooch Whatsapp Approval Form](https://smooch.io/whatsapp/form/?cid=cus_Eo2AJ02JNd0RdW)

------

### Step 3.

Clients will create a whatsapp template on Channel360, which we will post to the whatsapp template api in smooch

[Link to Whatsapp Approval Template API](https://docs.smooch.io/rest/v1/#whatsapp-message-templates)