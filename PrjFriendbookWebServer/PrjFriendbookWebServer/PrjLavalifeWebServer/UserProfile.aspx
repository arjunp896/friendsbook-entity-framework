<%@ Page Title="" Language="C#" MasterPageFile="~/Friendbook.Master" AutoEventWireup="true" CodeBehind="UserProfile.aspx.cs" Inherits="PrjFriendbookWebServer.UserProfile" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">



    <title>User Profile</title>

    <style>
        body {
            background: -webkit-linear-gradient(left, #3931af, #00c6ff);
        }

        .emp-profile {
            padding: 3%;
            margin-top: 3%;
            margin-bottom: 3%;
            border-radius: 0.5rem;
            background: #fff;
        }

            .emp-profile .fade {
                opacity: 1;
                font-size: 14px;
            }

                .emp-profile .fade label {
                    font-weight: bold;
                    font-size: 14px;
                    color: black;
                }


        .profile-img {
            text-align: center;
        }

            .profile-img img {
                width: 70%;
                height: 100%;
            }

            .profile-img .file {
                position: relative;
                overflow: hidden;
                margin-top: -20%;
                width: 70%;
                border: none;
                border-radius: 0;
                font-size: 15px;
                background: #212529b8;
            }

                .profile-img .file input {
                    position: absolute;
                    opacity: 0;
                    right: 0;
                    top: 0;
                }

        .profile-head h5 {
            color: black;
            font-size: 18px;
            font-weight: bold;
        }

        .profile-head h6 {
            color: #0062cc;
        }

        .profile-edit-btn {
            border: none;
            border-radius: 1.5rem;
            width: 70%;
            padding: 2%;
            font-weight: 600;
            color: #6c757d;
            cursor: pointer;
        }

        .proile-rating {
            font-size: 14px;
            color: #818182;
            margin-top: 5%;
        }

            .proile-rating span {
                color: #495057;
                font-size: 15px;
                font-weight: 900;
            }

        .profile-head .nav-tabs {
            margin-bottom: 5%;
        }

            .profile-head .nav-tabs .nav-link {
                font-weight: 600;
                border: none;
            }

                .profile-head .nav-tabs .nav-link.active {
                    border: none;
                    border-bottom: 2px solid #0062cc;
                }

        .profile-work {
            padding: 14%;
            margin-top: -15%;
        }

            .profile-work p {
                font-size: 12px;
                color: #818182;
                font-weight: 600;
                margin-top: 10%;
            }

            .profile-work a {
                text-decoration: none;
                color: #495057;
                font-weight: 600;
                font-size: 14px;
            }

            .profile-work ul {
                list-style: none;
            }

        .profile-tab label {
            font-weight: 600;
        }

        .profile-tab p {
            font-weight: 600;
            color: #0062cc;
            margin-top: 10px;
        }
    </style>

    <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" />
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <div class="container emp-profile">
        <form method="post">
            <div class="row">
                <div class="col-md-4">
                    <div class="profile-img">
                        <asp:Image ID="imgSearchUser" runat="server" />
                        <%--<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog" alt="" />--%>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="profile-head">
                        <h2>
                            <asp:Literal ID="litName" runat="server"></asp:Literal>
                        </h2>
                        <h5>
                            <asp:Literal ID="litUsername" runat="server"></asp:Literal></h5>

                        <p class="proile-rating">
                            Gender :
                            <asp:Literal ID="litGender" runat="server"></asp:Literal>
                        </p>
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item">About
                            </li>
                        </ul>
                    </div>
                </div>
                <%--                <div class="col-md-2">
                    <input type="submit" class="profile-edit-btn" name="btnAddMore" value="Edit Profile" />
                </div>--%>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="profile-work">
                        <%--                        <p>WORK LINK</p>
                        <a href="">Website Link</a><br />
                        <a href="">Bootsnipp Profile</a><br />
                        <a href="">Bootply Profile</a>
                        <p>SKILLS</p>
                        <a href="">Web Designer</a><br />
                        <a href="">Web Developer</a><br />
                        <a href="">WordPress</a><br />
                        <a href="">WooCommerce</a><br />
                        <a href="">PHP, .Net</a><br />--%>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="tab-content profile-tab" id="myTabContent">
                        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <div class="row">
                                <div class="col-md-3">
                                    <label>Email</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litEmail" runat="server"></asp:Literal>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <label>Birthdate</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litBirthdate" runat="server"></asp:Literal></p>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-3">
                                    <label>Postal Code</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litPostalCode" runat="server"></asp:Literal>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <label>Height</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litHeight" runat="server"></asp:Literal>''
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <label>Body Type</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litBodyType" runat="server"></asp:Literal>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <label>Ethinicity</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litEthinicity" runat="server"></asp:Literal>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <label>Religion</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litReligion" runat="server"></asp:Literal>
                                    </p>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-3">
                                    <label>Interested</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litInterested" runat="server"></asp:Literal>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <label>Looking for</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litLooking" runat="server"></asp:Literal>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <label>Education</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litEducation" runat="server"></asp:Literal>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <label>Smoking</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litSmoking" runat="server"></asp:Literal>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <label>Drinking</label>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <asp:Literal ID="litDrinking" runat="server"></asp:Literal>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

</asp:Content>
