using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebMag.Models;
using WebMag.Services;

namespace WebMag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        
        [HttpGet("authenticate")]
        public async Task<IActionResult> RegisterAsync()
        {
            return Ok(true);
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RegisterAsync(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);
            
            result = await _authService.GetTokenAsync(new TokenRequestModel()
            {
                Email = model.Email,
                Password = model.Password,
            });

            // if (!string.IsNullOrEmpty(result.RefreshToken))
            //     SetRefreshTokenInCookie(result.RefreshToken, result.RefreshTokenExpiration);


            return Ok(new
            {
                result.Token,
                result.RefreshToken,
                result.RefreshTokenExpiration,
                result.Email,
                result.Username,
                result.Roles
            });
        }

        //Login
        [HttpPost("token")]
        public async Task<IActionResult> GetTokenAsync([FromBody] TokenRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.GetTokenAsync(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            // if (!string.IsNullOrEmpty(result.RefreshToken))
            // SetRefreshTokenInCookie(result.RefreshToken, result.RefreshTokenExpiration);

            // Remove cookie setting and just return in body
            return Ok(new
            {
                result.Token,
                result.RefreshToken,
                result.RefreshTokenExpiration,
                result.Email,
                result.Username,
                result.Roles
            });
        }

        [HttpPost("addrole")]
        public async Task<IActionResult> AddRoleAsync([FromBody] AddRoleModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.AddRoleAsync(model);

            if (!string.IsNullOrEmpty(result))
                return BadRequest(result);

            return Ok(model);
        }

        //refresh token
        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var result = await _authService.RefreshTokenAsync(request.RefreshToken);

            if (!result.IsAuthenticated)
                return BadRequest(result);

           
            return Ok(new {
                Token = result.Token,
                RefreshToken = result.RefreshToken, // Return new refresh token in body
                Expires = result.RefreshTokenExpiration
            });
        }

        [HttpPost("revokeToken")]
        public async Task<IActionResult> RevokeToken([FromBody] RevokeToken model)
        {
            var token = model.Token ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
                return BadRequest("Token is required!");

            var result = await _authService.RevokeTokenAsync(token);

            if (!result)
                return BadRequest("Token is invalid!");

            return Ok();
        }

        private void SetRefreshTokenInCookie(string refreshToken, DateTime expires)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = expires.ToLocalTime(),
                Secure = true,
                IsEssential = true,
                SameSite = SameSiteMode.None
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersAsync()
        {
            var result = await _authService.GetUsersWithRolesAsync();
            return Ok(result);
        }
        
    }
}