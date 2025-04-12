namespace WebMag.Models;

public class UserWithRolesModel
{
    public string id { get; set; }
    public string userName { get; set; }
    public string email { get; set; }
    public string firstName { get; set; }
    public string lastName { get; set; }
    public List<string> roles { get; set; } = new List<string>();
}