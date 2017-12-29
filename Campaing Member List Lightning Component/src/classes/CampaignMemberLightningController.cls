public class CampaignMemberLightningController {

    @AuraEnabled
    public static List<CampaignMember> getCampaignMembers(Id campaignId){
        return [SELECT id, CampaignId, LeadOrContactId, CompanyOrAccount, Name, Title, Status, DoNotCall, Type FROM CampaignMember WHERE campaignId =: campaignId];
    }
}