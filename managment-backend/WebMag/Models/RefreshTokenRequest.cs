using System.ComponentModel.DataAnnotations;

namespace WebMag.Models;

public class RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; set; }
}