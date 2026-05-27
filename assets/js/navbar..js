function navbar()
{
var navbar = "<header class="header-area header-sticky">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <nav class="main-nav">
                        <a href="/" class="logo">
                            Impact Colliders
                        </a>
                        <ul class="nav">
                            <li class="scroll-to-section"><a href="#welcome">Home</a></li>
                            <li><a href="videos?show=all">About Us</a></li>
                            <li><a href="videos?show=all">Video Library</a></li>
                            <li><a href="videos?show=all">Digital Game</a></li>
                            <li><a href="videos?show=all">Shop</a></li>
                        </ul>
                        <a class='menu-trigger'>
                            <span>Menu</span>
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    </header>";
$('#header').html(navbar);
}