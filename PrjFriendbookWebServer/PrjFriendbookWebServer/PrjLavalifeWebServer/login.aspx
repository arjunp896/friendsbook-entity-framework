<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="PrjFriendbookWebServer.login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Welcome back to Lavalife.com! Log in to your online dating profile to see your messages, likes and other notifications now." />


    <title>Log In – Lavalife.com Online Dating Site & Mobile Apps – Where Singles Click®</title>


    <!-- Styles -->
    <link href="css/finalbuild.css" rel="stylesheet" />
    <link href="css/bootstrap-tour.min.css" rel="stylesheet" />
    <script src="js/angular.min.js"></script>
    <script src="js/directives.js"></script>
    <script src="js/angulartics.js"></script>
    <script src="js/angulartics-ga.js"></script>




</head>
<body>

    <div id="wrap">
        <div class="mobile-dl">
            <a href="">
                <img /></a>
        </div>

        <a href="./" id="logo-signup" class="visible-lg visible-md visible-sm"></a>

        <nav class="navbar navbar-default visible-xs" role="navigation">

            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header col-xs-12">

                <button type="button" class="navbar-toggle collapsed col-xs-4" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <a href="./" id="logo" class="navbar-brand"></a>

            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse col-xs-12" id="bs-example-navbar-collapse-1" style="margin-top: 10px;">
                <ul class="nav navbar-nav">
                    <li><a href="privacy-policy.html" target="_blank">Privacy Policy</a></li>
                    <li><a href="terms-of-use.html" target="_blank">Terms of Service</a></li>
                    <li><a href="FAQ.html" target="_blank">FAQ</a></li>
                </ul>

            </div>
            <!-- /.navbar-collapse -->
        </nav>

        <section class="container" style="min-width: 300px !important;">

            <div class="row login-holder">

                <div class="col-lg-8r col-md-8 col-sm-8 hidden-xs login-left">
                </div>

                <div class="col-lg-4 col-md-4 col-sm-12" id="login">
                    <div class="lil-logo">
                        <img src="images/landing/ll_logo_registration_circle_sml.png" />
                    </div>

                    <h2>Log in
                        <br />
                        <span>Welcome back to lavalife!</span></h2>

                    <div class="step-content">

                        <%--error--%>

                        <%--<div class="errors-holder">&nbsp;</div>--%>

                        <asp:Label runat="server" ForeColor="Red" ID="lblError" Font-Bold="True"></asp:Label>

                        <form runat="server" class="login-form" role="form">

                            <div class="form-group">
                                <label for="interested">username</label>
                                <%--<input type="text" name="login" />--%>
                                <asp:TextBox ID="txtEmail" runat="server"></asp:TextBox>
                                <asp:RequiredFieldValidator runat="server" ID="reqEmail" ControlToValidate="txtEmail" ErrorMessage="Email is required" Font-Bold="True" ForeColor="Red" />

                            </div>

                            <div class="form-group">
                                <label for="password">Password <span style="display: block; float: right;"><a href="forgot.html" tabindex="-1">Forgot Password</a></span></label>
                                <%--<input type="password" name="password" data-validation="required" />--%>

                                <asp:TextBox runat="server" ID="txtPassword" TextMode="Password"></asp:TextBox>
                                <asp:RequiredFieldValidator runat="server" ID="reqPassword" ControlToValidate="txtPassword" ErrorMessage="Password is required" Font-Bold="True" ForeColor="Red" />

                            </div>

                            <%--login button--%>

                            <%--<button class="sign-up" style="margin-top: 80px;">Login</button>--%>
                            <asp:Button runat="server" ID="btnLogin" CssClass="login-sign-up" Text="Login" OnClick="btnLogin_Click" />
                            <%--<input type="hidden" name="returnStatusOnly" value="Y" data-validation="required" />--%>
                            <%--<input type="hidden" name="ioBB" id="ioBB" />--%>
                        </form>

                        <div class="sign-up-facebook" style="margin-bottom: 80px;">
                            <p>or</p>
                            <button class="facebook">Log In with Facebook</button>
                        </div>

                        <div class="devider-line"></div>


                        <div id="" style="text-align: center; margin-top: 25px; margin-bottom: 25px; color: #757575;">
                            Not a member yet? 
                            <strong>
                                <%--<a href="<% Response.Write(PrjLavalifeWebServer.util.Constants.PAGE_SIGN_UP); %>">Sign Up.</a>--%>
                                <a href="<%= PrjFriendbookWebServer.util.Constants.PAGE_SIGN_UP %>">Sign Up.</a>

                            </strong>
                        </div>

                    </div>

                </div>

            </div>

        </section>

    </div>

    <%--------------------------%>

    <div id="footer" class="hidden-sm hidden-xs">

        <footer class="container" style="min-width: 300px !important;">
            <div class="col-md-1"></div>
            <div class="col-md-2">
                <img style="margin-top: 40px;" src="images/landing/ll_logodotcom_footer.png" />
            </div>

            <div class="col-md-8">
                <p class="terms" style="text-transform: capitalize;">
                    All images design and other intellectual materials and copyrights © 2015 Lavalife Ltd. All Rights Reserved. This is an adult service. By selecting any of the options above and/or creating your Lavalife profile, you are confirming that
                    you are 18 years of age or older. Please be sure you have read and agree to our <a href="privacy-policy.html" target="_blank">Privacy Policy</a> and <a href="terms-of-use.html" target="_blank">Terms of Use</a>.
                </p>
            </div>

            <div class="col-md-1"></div>
        </footer>

    </div>

    <div id="fb-root"></div>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="js/jquery.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/plugins.js"></script>
    <script src="js/app.js"></script>
    <script src="js/controllers.js"></script>
    <script src="js/functions.js"></script>

    <script type="text/javascript">
        $("body").backstretch("images/spring/lavalife_bg_spring_2015.jpg");

    </script>

    <script src="https://mpsnare.iesnare.com/snare.js"></script>

</body>
</html>
