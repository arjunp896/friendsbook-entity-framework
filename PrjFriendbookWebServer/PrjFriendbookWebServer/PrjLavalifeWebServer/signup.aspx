<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="signup.aspx.cs" Inherits="PrjFriendbookWebServer.css.signup" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">


    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sign Up – Lavalife.com Online Dating Site & Mobile Apps – Where Singles Click®</title>
    <meta name="description" content="Sign up for Lavalife.com online dating and get a 7 day free trial. Browse unlimited profiles, send unlimited messages and start having fun." />
    <!-- Styles -->
    <link href="css/finalbuild.css" rel="stylesheet" />
    <link href="css/bootstrap-tour.min.css" rel="stylesheet" />
    <%--<script src="js/angular.min.js"></script>--%>
    <%--<script src="js/directives.js"></script>--%>
    <%--<script src="js/angulartics.js"></script>--%>
    <%--<script src="js/angulartics-ga.js"></script>--%>


    <style>
        input[type=radio] {
            margin: 0px 5px !important;
            height: 20px !important;
            width: 20px !important;
            border: 1px solid dotted;
        }

        #radGender label {
            display: inline;
            vertical-align: top;
            width: fit-content;
            margin: 0px !important;
            font-size: 15px;
        }

        #radGender td {
            vertical-align: middle;
            height: 35px;
            width: fit-content;
            font-size: 15px;
        }

        label {
            color: #757575;
            font-size: 13px;
        }

        .label {
            color: #212121 !important;
            padding-left: 0px !important;
            font-family: "Open Sans", sans-serif !important;
            font-size: 14px !important;
            font-weight: 500 !important;
        }

        h2 {
            margin-top: 12px;
            text-align: left;
            line-height: 25px;
            margin: 10px 0;
            color: #ff0000;
            font-weight: 300;
            padding-left: 50px;
            background-repeat: repeat-y;
        }

        .selectric {
            border-color: #e5e5e5 !important;
        }

        input {
            color: #212121;
            border-color: #e5e5e5 !important;
        }

        .devider-line {
            margin-top: 30px;
        }

        .itemPanel {
            -webkit-box-shadow: 0px 2px 2px 1px #555;
            -moz-box-shadow: 0px 2px 2px 1px #555;
            box-shadow: 0px 2px 2px 1px #555;
            border: solid 1px #757575;
        }

        .crop-cancel {
            display: none;
        }
    </style>

</head>

<body>

    <form class="register-form" runat="server">

        <!-- Wrap all page content here -->
        <div id="wrap">

            <a href="./index.aspx" id="logo-signup" class="visible-lg visible-md visible-sm"></a>

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

                <div class="row register-holder">

                    <div class="col-md-8 hidden-sm hidden-xs" style="position: relative; height: 100%; padding: 0px;">

                        <div class="backgrounds">
                            <img class="selected" src="images/spring/ll_step1_img.jpg" />
                        </div>
                    </div>

                    <div class="col-md-4 col-sm-12" id="register">

                        <div class="lil-logo">
                            <img src="images/landing/ll_logo_registration_circle_sml.png" />
                        </div>

                        <asp:Panel ID="step1" CssClass="step-1" runat="server">

                            <%--                    <div id="step1" class="step-1">--%>

                            <h2>Create Your Profile
                            <%--                            <br />
                            <span>AND RECEIVE A 7-DAY FREE TRIAL.</span>--%>
                            </h2>

                            <div class="step-content">


                                <%--error--%>

                                <%--<div class="errors-holder">This is error</div>--%>

                                <asp:Label runat="server" ID="lblError" Font-Bold="True" ForeColor="Blue">
                                

                                </asp:Label>


                                <%--firstname--%>

                                <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6" style="padding: 0px; padding-right: 5px;">
                                    <label for="interested">First Name</label>
                                    <%--<input type="text" style="text-transform: capitalize;" name="fname" data-validation="required" id="fname" ng-model="firstName" />--%>

                                    <asp:TextBox runat="server" ID="txtFname" />
                                    <asp:RequiredFieldValidator ID="reqFirstName" runat="server" ControlToValidate="txtFname" Font-Bold="True" ErrorMessage="firstname is required" Display="None" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                </div>

                                <%-- lastname --%>

                                <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6" style="padding: 0px;">
                                    <label for="interested">Last Name</label>
                                    <%--<input type="text" style="text-transform: capitalize;" name="lname" data-validation="required" id="lname" ng-model="lastName" />--%>

                                    <asp:TextBox runat="server" ID="txtLname" />
                                    <asp:RequiredFieldValidator ID="reqLastName" runat="server" ControlToValidate="txtLname" Font-Bold="True" ErrorMessage="lastname is required" Display="None" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                </div>

                                <%-- username --%>

                                <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6" style="padding: 0px; padding-right: 5px;">
                                    <label for="interested">Username</label>
                                    <%--<input type="text" style="text-transform: capitalize;" name="fname" data-validation="required" id="fname" ng-model="firstName" />--%>

                                    <asp:TextBox runat="server" ID="txtUsername" />
                                    <asp:RequiredFieldValidator ID="reqUsername" runat="server" ControlToValidate="txtUsername" Font-Bold="True" ErrorMessage="username is required" Display="None" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                </div>

                                <%-- gender --%>

                                <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6" style="padding: 0px;">
                                    <label for="interested">Gender</label>

                                    <asp:RadioButtonList CssClass="col-lg-12" ID="radGender" runat="server" RepeatDirection="Horizontal" RepeatLayout="Table" TextAlign="Left">

                                        <asp:ListItem Value="male">Male</asp:ListItem>
                                        <asp:ListItem Value="female">Female</asp:ListItem>

                                    </asp:RadioButtonList>

                                    <asp:RequiredFieldValidator ID="reqGender" runat="server" ControlToValidate="radGender" Font-Bold="True" ErrorMessage="gender is required" Display="None" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                </div>


                                <div class="form-group">
                                    <label for="interested">I'm a</label>
                                    <%--                                    <select data-validation="required" name="interested" id="interested-select" class="col-md-12 col-sm-12 col-xs-12"
                                        ng-model="iMA"
                                        ng-options="seeking.letter as seeking.name for seeking in seeking track by seeking.letter">
                                    </select>--%>

                                    <asp:DropDownList runat="server" ID="cboIma">
                                        <asp:ListItem>Select</asp:ListItem>
                                    </asp:DropDownList>

                                    <asp:RequiredFieldValidator ID="reqIma" runat="server" ControlToValidate="cboIma" Font-Bold="True" ErrorMessage="i'm a field is required" Display="None" InitialValue="Select"></asp:RequiredFieldValidator>

                                </div>

                                <div class="form-group col-md-12 col-sm-12 col-xs-12" style="padding: 0px;">

                                    <label for="interested">Birthday</label>

                                    <asp:DropDownList runat="server" ID="cboMonth" CssClass="col-md-5 col-sm-4 col-xs-4 select-small">
                                        <asp:ListItem>Month</asp:ListItem>
                                    </asp:DropDownList>

                                    <asp:RequiredFieldValidator ID="reqMonth" runat="server" ControlToValidate="cboMonth" Font-Bold="True" ErrorMessage="month is required" Display="None" InitialValue="Month"></asp:RequiredFieldValidator>

                                    <asp:DropDownList runat="server" ID="cboDay" CssClass="col-md-3 col-sm-4 col-xs-4 select-small">
                                        <asp:ListItem>Day</asp:ListItem>
                                    </asp:DropDownList>
                                    <asp:RequiredFieldValidator ID="reqDay" runat="server" ControlToValidate="cboDay" Font-Bold="True" ErrorMessage="day is required" Display="None" InitialValue="Day"></asp:RequiredFieldValidator>


                                    <asp:DropDownList runat="server" ID="cboYear" CssClass="col-md-4 col-sm-4 col-xs-4 select-small">
                                        <asp:ListItem>Year</asp:ListItem>
                                    </asp:DropDownList>
                                    <asp:RequiredFieldValidator ID="reqYear" runat="server" ControlToValidate="cboYear" Font-Bold="True" ErrorMessage="year is required" Display="None" InitialValue="Year"></asp:RequiredFieldValidator>

                                </div>

                                <div class="form-group">
                                    <label for="interested">Email Address</label>
                                    <asp:TextBox runat="server" ID="txtEmail" TextMode="Email" />
                                    <asp:RequiredFieldValidator ID="reqEmail" runat="server" ControlToValidate="txtEmail" Font-Bold="True" ErrorMessage="email is required" Display="None" SetFocusOnError="True"></asp:RequiredFieldValidator>
                                    <asp:RegularExpressionValidator ID="reqRegExEmail" runat="server" ErrorMessage="please enter valid email" Display="None" ControlToValidate="txtEmail" ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"></asp:RegularExpressionValidator>
                                </div>

                                <div class="form-group" ng-if="!fbAccessToken">
                                    <label for="password">Password</label>
                                    <asp:TextBox runat="server" ID="txtPassword" TextMode="Password"></asp:TextBox>

                                    <asp:RequiredFieldValidator ID="reqPassword" runat="server" ControlToValidate="txtPassword" Font-Bold="True" ErrorMessage="password is required" Display="None" SetFocusOnError="True"></asp:RequiredFieldValidator>

                                </div>
                                <asp:Panel Style="max-height: 90px; overflow: auto" ID="Panel1" runat="server">

                                    <asp:ValidationSummary ID="ValidationSummary1" runat="server" DisplayMode="List" Font-Bold="True" Font-Size="Small" ForeColor="Red" />

                                </asp:Panel>


                                <asp:Button runat="server" ID="btnJoinNow" Text="join now"
                                    CssClass="login-sign-up" OnClick="btnJoinNow_Click" />
    </form>

    <%--                            <div ng-if="!fbAccessToken"
                                class="sign-up-facebook" style="margin-bottom: 50px;">
                                <p>or</p>
                                <button class="facebook" ng-click="signUpFacebook()">Sign Up with Facebook</button>
                            </div>--%>

    <div class="devider-line"></div>

    <div class="sign-up-facebook">
        <p>Already a member? <a href="login.aspx">Log in.</a></p>
    </div>

    </div>

                        <%--</div>--%>
                    </asp:Panel>







                    <%--                    <div id="step2" class="step-2 hidden">--%>
    <asp:Panel ID="step2" CssClass="step-col-lg-12 hidden" runat="server">

        <h2>You're Almost There
                            <br />
            <span>TELL US SOME MORE ABOUT YOU.</span></h2>

        <div class="step-content">


            <div style="padding-bottom: 40px; max-height: 500px;">

                <div class="form-group" id="postalCodeForm">
                    <label for="interested">Postal / Zip Code</label>
                    <!--<input type="text" name="postalCode" id="postalCode" data-validation="length alphanumeric required" data-validation-length="5-6" /> valid_postal_code -->
                    <asp:TextBox ID="txtPostalCode" runat="server"></asp:TextBox>
                </div>

                <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6" style="padding: 0px; padding-right: 5px;">
                    <label for="interested">Height in Feet</label>

                    <asp:DropDownList ID="cboHeight" runat="server">

                        <asp:ListItem Value="">select height</asp:ListItem>

                    </asp:DropDownList>

                </div>

                <div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6" style="padding: 0px;">
                    <label for="interested">Inches</label>

                    <asp:DropDownList ID="cboInches" runat="server">

                        <asp:ListItem Value="">select Inches</asp:ListItem>

                    </asp:DropDownList>
                </div>

                <div class="form-group">
                    <label for="interested">Body Type</label>
                    <asp:DropDownList ID="cboBodyType" runat="server">

                        <asp:ListItem Value="">select body type</asp:ListItem>

                    </asp:DropDownList>

                </div>

                <div class="form-group">
                    <label for="interested">Ethnicity</label>
                    <asp:DropDownList ID="cboEthnicity" runat="server">

                        <asp:ListItem Value="">select ethinicity</asp:ListItem>

                    </asp:DropDownList>

                </div>

                <div class="form-group">
                    <label for="interested">Religion</label>
                    <asp:DropDownList ID="cboReligion" runat="server">
                        <asp:ListItem Value="">select religion</asp:ListItem>
                    </asp:DropDownList>
                </div>

                <div class="form-group">
                    <label for="interested">Education</label>
                    <asp:DropDownList ID="cboEducation" runat="server">
                        <asp:ListItem Value="">select education</asp:ListItem>
                    </asp:DropDownList>
                </div>
                <div class="form-group">
                    <label for="interested">Looking For</label>
                    <asp:DropDownList ID="cboLooking" runat="server">
                        <asp:ListItem Value="">select looking for</asp:ListItem>
                    </asp:DropDownList>
                </div>
                <div class="form-group col-lg-6">
                    <label for="interested">Smoking</label>
                    <asp:DropDownList ID="cboSmoking" runat="server">
                        <asp:ListItem Value="">select</asp:ListItem>
                    </asp:DropDownList>
                </div>
                <div class="form-group col-lg-6">
                    <label for="interested">Drinking</label>
                    <asp:DropDownList ID="cboDrinking" runat="server">
                        <asp:ListItem Value="">select</asp:ListItem>
                    </asp:DropDownList>
                </div>

            </div>

            <asp:Button runat="server" ID="btnSubmitStep2" Text="Submit"
                CssClass="login-sign-up" OnClick="btnSubmitStep2_Click" />

        </div>
    </asp:Panel>

    <asp:HiddenField ID="hidUserId" runat="server" />

    <%--                    </div>--%>



    <div id="footer" class="hidden-sm hidden-xs">

        <footer class="container" style="min-width: 300px !important;">
            <div class="col-md-1"></div>
            <div class="col-md-2">
                <img style="margin-top: 40px;" src="images/landing/ll_logodotcom_footer.png" />
            </div>

            <div class="col-md-8">
                <p class="terms" style="text-transform: capitalize;">
                    All images design and other intellectual materials and copyrights © 2015 Lavalife Ltd. All Rights Reserved. This is an adult service. By selecting any of the options above and/or creating your Lavalife profile, you are confirming that you are 18 years of age or older. 
				Please be sure you have read and agree to our <a href="privacy-policy.html" target="_blank">Privacy Policy</a> and <a href="terms-of-use.html" target="_blank">Terms of Use</a>.
                </p>
            </div>

            <div class="col-md-1"></div>
        </footer>

    </div>

    <div id="loader"></div>

    <div class="modal" data-backdrop="static" id="location-modal"></div>

    <div id="fb-root"></div>
    </form>
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

        $(document).ready(function () {

            $('select').selectric({
                disableOnMobile: false
            });
            dropThatSelect();
        });

        var io_operation = 'ioBegin';
        var io_bbout_element_id = 'ioBB';
        var io_install_stm = false;
        var io_install_flash = false;
        var io_exclude_stm = 12; // don't use Active X on Vista or XP as they cause warnings on IE8
        var wsResponseForm;

        function redirectActiveX() { document.location.href = "explainActiveX.html"; }

        function redirectFlash() { document.location.href = "http://www.macromedia.com/flash"; }

        //var io_install_stm_error_handler = "redirectFlash();";

        var io_max_wait = 5000;

        var io_submit_form_id = wsResponseForm;

        var io_submit_element_id = 'submit1';

    </script>

    <script src="https://mpsnare.iesnare.com/snare.js"></script>
    <script src="js/cj-lavalife.js"></script>
</body>
</html>

