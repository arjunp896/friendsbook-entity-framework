<%@ Page Title="" Language="C#" MasterPageFile="~/Friendbook.Master" AutoEventWireup="true" CodeBehind="Dashboard.aspx.cs" Inherits="PrjFriendbookWebServer.WebForm1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

    
    <style type="text/css">
        .cbo-box {
            margin-top: 10px;
        }

        .radio-list td span {
            vertical-align: text-bottom;
        }

        #radGender .icr{
            margin: 15px 10px 10px 0px !important; 
        }

        #search_option .col-lg-1,
        #search_option .col-lg-2,
        #search_option .col-lg-3,
        #search_option .col-lg-4,
        #search_option .col-lg-5,
        #search_option .col-lg-6,
        #search_option .col-lg-7,
        #search_option .col-lg-7,
        #search_option .col-lg-9 {
            padding-right: 1px !important;
            padding-left: 1px !important;
        }

        .search-btn{
            margin-top:15px;
            width:100%;
        }

        #search_option label {
            font-weight: bold !important;
            color: black;
            text-transform: capitalize;
            font-size: 14px;
        }

        .selectric .label {
            padding: 7px 0px 0px 0px !important;
            margin: 0px !important;
        }


        @charset "UTF-8";

        [ng\:cloak],
        [ng-cloak],
        [data-ng-cloak],
        [x-ng-cloak],
        .ng-cloak,
        .x-ng-cloak,
        .ng-hide {
            display: none !important;
        }

        ng\:form {
            display: block;
        }

        .ng-animate-block-transitions {
            transition: 0s all !important;
            -webkit-transition: 0s all !important;
        }

        .ng-hide-add-active,
        .ng-hide-remove {
            display: block !important;
        }
    </style>

    <title>Dashboard</title>

</asp:Content>



<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <div class="main ng-scope">
        <section class="container container-padding ng-scope">

            <div class="clearfix"></div>
            <form runat="server">
                <div class="regular-section username-search col-lg-6">
                    <label style="margin-top: 0px;" onclick="openUsernameSearch()">USERNAME SEARCH +</label>
                </div>

                <div class="modal" data-backdrop="static" id="username-search-modal"></div>

                <div id="search_option" class="search advanced-open col-xs-12">

                    <!-- Gender -->
                    <div class="regular-section col-lg-2">
                        <label class="col-lg-4">Gender: </label>
                        <div class="col-lg-3">

                            <asp:RadioButtonList CssClass="radio-list" ID="radGender" runat="server" RepeatDirection="Horizontal" AutoPostBack="True">
                                <asp:ListItem Value="Male" Text="Male"></asp:ListItem>
                                <asp:ListItem Value="Female" Text="Female"></asp:ListItem>
                            </asp:RadioButtonList>
                        </div>
                    </div>

                    <!-- looking -->
                    <div class="regular-section col-lg-2">
                        <label style="text-align: center;" class="col-lg-5">Looking: </label>
                        <div class="col-lg-7" style="padding: 0px; line-height: 60px;" id="looking-for-search">
                            <div class="btn-group cbo-box">

                                <asp:DropDownList ID="cboLooking" runat="server" Height="12px" AutoPostBack="True" OnSelectedIndexChanged="search_SelectedIndexChanged">

                                    <asp:ListItem Value="">Select</asp:ListItem>

                                </asp:DropDownList>
                            </div>
                        </div>
                    </div>

                    <%-- Age --%>
                    <div class="regular-section col-lg-2">

                        <label class="col-lg-3" style="text-align: center;">Age: </label>

                        <div class="col-lg-3" style="padding: 0px; line-height: 60px;" id="min-age-search">

                            <div class="btn-group cbo-box">

                                <asp:DropDownList ID="cboAgeFrom" runat="server" AppendDataBoundItems="True" Font-Bold="True" AutoPostBack="True" OnSelectedIndexChanged="search_SelectedIndexChanged">
                               
                                    <asp:ListItem Value="">Any</asp:ListItem>

                                    </asp:DropDownList>
                            </div>
                        </div>

                        <label class="col-lg-3" style="text-align: center; padding: 0px;">To</label>

                        <div class="col-lg-3" style="padding: 0px; line-height: 60px;" id="max-age-search">

                            <div class="btn-group cbo-box">
                                <asp:DropDownList ID="cboAgeTo" runat="server" AutoPostBack="True" OnSelectedIndexChanged="search_SelectedIndexChanged">
                                    <asp:ListItem Value="">Any</asp:ListItem>
                                </asp:DropDownList>
                            </div>
                        </div>
                    </div>

                    <%-- Ethinicity --%>

                    <div class="regular-section col-lg-2">
                        <label style="text-align: center;" class="col-lg-6">Ethinicity: </label>
                        <div class="col-lg-6" style="padding: 0px; line-height: 60px;">
                            <div class="btn-group cbo-box">

                                <asp:DropDownList ID="cboEthinicity" runat="server" AutoPostBack="True" OnSelectedIndexChanged="search_SelectedIndexChanged">
                                    <asp:ListItem Value="">Select</asp:ListItem>
                                </asp:DropDownList>

                            </div>
                        </div>
                    </div>

                    <%-- Religion --%>

                    <div class="regular-section col-lg-2">
                        <label style="text-align: center;" class="col-lg-6">Religion: </label>
                        <div class="col-lg-6" style="padding: 0px; line-height: 60px;">
                            <div class="btn-group cbo-box">

                                <asp:DropDownList ID="cboReligion" runat="server" AutoPostBack="True" OnSelectedIndexChanged="search_SelectedIndexChanged">
                                    <asp:ListItem Value="">Select</asp:ListItem>
                                </asp:DropDownList>

                            </div>
                        </div>
                    </div>


                    <!-- search button -->

                    <p class="col-lg-2">
                        <!--<a href="dashboard.html#/" style="text-decoration:none;">-->

                        <asp:Button ID="btnSearch" CssClass="search-btn" runat="server" Text="Search" />
               
                    </p>




                    <div class="modal" data-backdrop="static" id="advanced-search-modal" aria-hidden="true" style="display: none;"></div>

                    <div style="position: absolute; width: 100%;">
                        <div id="username-search-popup" class="username-search-popup ng-hide" ng-show="searchUsername" style="padding-bottom: 80px;">

                            <div class="col-xs-6 col-xs-6 col-xs-6">
                                <h3>Username Search</h3>
                            </div>

                            <div class="formgroup col-xs-12" style="padding: 0 120px;">
                                <label class="col-xs-12" style="padding-left: 0px;">Username</label>
                                <div class="col-xs-12" style="padding: 0px;" id="username-search">
                                    <input name="nickname" class="col-xs-6" type="text" />
                                    <div class="col-xs-6">
                                        <div id="nickname-search" style="height: 35px; line-height: 35px;" class="redBtn save saveProfile">
                                            SEARCH
                                        <img style="position: absolute; right: 30px; top: 8px;" src="images/icons/ll_button_ic_search.png" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="clearfix"></div>

                            <div onclick="closeUsernameSearch()" class="close-modal"></div>

                        </div>
                    </div>

                </div>
            </form>
            <%--<div id="search-holder" class="col-xs-8 col-xs-8 col-xs-8" style="padding: 25px; padding-top: 0px;">--%>

            <div class="col-lg-12" style="padding: 25px; padding-top: 0px;">
                <div id="search-holder" class="col-xs-12" style="position: relative;">
                    <div ng-show="searchResults.length == 0 &amp;&amp; loadGif == false &amp;&amp; searchId != -1" style="text-align: center; margin-top: 44%;" class="ng-hide">
                        <img src="images/ll_error_ic_search_with_text.png" />
                    </div>

                    <div ng-show="searchResults.length == 0 &amp;&amp; loadGif == false &amp;&amp; searchId == -1" style="text-align: center; margin-top: 44%;" class="ng-hide">
                        <h4 style="margin-bottom: 20px;">Your previous search result has expired.</h4>
                        <button style="width: 180px; margin: auto;" class="redBtn toggle" ng-click="advancedSearch(undefined, 'Advanced Search')">REFRESH</button>
                    </div>


                    <div id="no-results" style="text-align: center; margin-top: 50%;" ng-hide="loadGif == false" class="ng-hide">
                        <img src="images/search-pre.gif" />
                    </div>





                    <asp:Repeater ID="repeatUserSearchResult" runat="server">

                        <ItemTemplate>
                            <a href="UserProfile.aspx?username=<%# Eval("username") %>">
                                <div class="user-holder col-lg-3 ng-scope">
                                    <div class="user-search col-xs-12">

                                        <div class="user-search-avatar">

                                            <%--<img src="<%# Eval("image_src") %>" alt="images/ll_profile_female_img.png" class="img-responsive" />--%>
                                            <img src="<%# Eval("ImageUrl").ToString() == "" 
                                                ? Eval("gender").ToString() == "Female" 
                                                    ? "images/ll_profile_female_img.png"
                                                    : "images/ll_profile_male_img.png"
                                                : Eval("imageurl").ToString()%>"
                                                class="img-responsive" />
                                        </div>

                                        <div class="user-name-location col-xs-12" style="padding: 0px;">

                                            <p>
                                                <%# Eval("firstname") %>&nbsp;<%# Eval("lastname")%>
                                                <%--<span class="ng-binding">address</span>--%>
                                            </p>

                                        </div>

                                    </div>
                                </div>
                            </a>
                        </ItemTemplate>

                    </asp:Repeater>


                    <div class="search-nav" ng-show="searchResults.length > 0">
                        <div class="search-left ng-hide" ng-show="prevPage > 0">
                            <a ng-click="advancedSearch( prevPage, 'Grid Previous' )"></a>
                        </div>
                        <div class="search-right ng-hide" ng-show="nextPage > 0">
                            <a ng-click="advancedSearch( nextPage, 'Grid Next' )"></a>
                        </div>
                    </div>


                </div>
            </div>
        </section>
    </div>

</asp:Content>
