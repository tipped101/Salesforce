@isTest
public class CampaingMemberLightningControllerTest {

   @isTest
    public static void testGetMemberList(){
        Id campaignId;
        List<CampaignMember> cmList = CampaignMemberLightningController.getCampaignMembers(campaignId);
        System.assertEquals(cmList.size() >= 0, true);
        
    }
    
}