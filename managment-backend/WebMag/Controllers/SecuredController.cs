using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebMag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecuredController : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "User")]
        public IActionResult GetData()
        {
            return Ok("Hello from secured controller");
        }
    }
}
