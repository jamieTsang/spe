using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.SessionState;
using System.Drawing;
using System.IO;

public partial class subject_edit_spe_Editor : System.Web.UI.Page
{
    public class PageElement { 
        public string fileName;
        public string title;
        public string keywords;
        public string description;
        public int imgNum;
        public List<int> imgHeight;
        //public int lastImgHeight;
        public string bgHeight;
        public string defaultCss;
        public string mainImgRepeater;
        public string footScript;
        public string cssLinksString;
        public bool isSucess=true;
        public ArgumentException exception;
        public PageElement(string path,string fullPath) {
            this.fileName = path;
            try {
                string xmlPath = fullPath+"datas/page.config.xml";
                var data = XDocument.Load(xmlPath);
                var root = data.Element("root");
                this.title = root.Element("title").Value;
                this.keywords = root.Element("keywords").Value;
                this.description = root.Element("description").Value;
                Array imgInfo = new DirectoryInfo(fullPath).GetFiles("images/index_*.jpg");
                int dataContHeight = 0;
                imgHeight=new List<int>();
                if (imgInfo.Length > 0)
                {
                    this.imgNum = imgInfo.Length;
                    foreach (FileInfo img in imgInfo)
                    {
                        int imgh = System.Drawing.Image.FromFile(img.FullName).Height;
                        imgHeight.Add(imgh);
                        dataContHeight += imgh;
                    }
                }
                else {
                    this.imgNum = 1;
                    imgHeight.Add(300);
                    dataContHeight = 300;
                }
                //var _imgNum = root.Element("imgNum").Value;
                //this.imgNum = int.Parse(_imgNum == "" ? "0" : _imgNum);
                //var _imgHeight = root.Element("imgHeight").Value;
                //this.imgHeight = int.Parse(_imgHeight == "" ? "0" : _imgHeight);
                //var _lastImgHeight = root.Element("lastImgHeight").Value;
                //this.lastImgHeight = int.Parse(_lastImgHeight == "" ? "0" : _lastImgHeight);
                var bgColor = root.Element("bgColor").Value;
                this.bgHeight = root.Element("bgHeight").Value;
                var bgURL = root.Element("bgURL").Value;
                var mainWidth = root.Element("mainWidth").Value;
                var soldOutY = root.Element("soldOutY").Value;
                var starTime = root.Element("starTime").Value;
                var endTime = root.Element("endTime").Value;
                var author = root.Element("author").Value;
                var cssLinks = from c in root.Elements("object")
                               where c.Element("type").Value == "cssLink"
                               select c;
                //专题CSS
                this.defaultCss = "body{background:#" + bgColor + ";position:relative}.bgStyle{height:" + this.bgHeight + "px; background:url(/subject/" + this.fileName + "/images/" + bgURL + ") top center no-repeat}.bgBottomStyle{height:101px; background:url(/subject/" + this.fileName + "/images/bg_bottom_01.jpg) top center no-repeat;bottom:444px;*bottom:450px}.main_bg{width:" + mainWidth + "px}.dataCont{height:" + dataContHeight + "px}.link{ background:url(/subject/" + this.fileName + "/images/sprite.png) no-repeat 0 0}.line .soldOut{background-position:0 -" + soldOutY + "px}";
                //切片
                string index;
                for (int i = 0; i < imgInfo.Length; i++)
                {
                    index = (i < 9) ? ("0" + (i + 1).ToString()) : (i + 1).ToString();
                    //height = (i < (imgNum - 1)) ? _imgHeight : _lastImgHeight;
                    mainImgRepeater += "<div class=\"main\"><img src=\"/subject/" + this.fileName + "/images/index_" + index + ".jpg\" height=\"" + imgHeight.ElementAt(i) + "\"/></div>"; ;
                }
                //外部样式表
                foreach(XElement cssLink in cssLinks){
                    this.cssLinksString += "<link rel=\"stylesheet\" type=\"text/css\" href=\""+ cssLink.Element("href").Value + "\"/>";
                }
                //页脚
                this.footScript = "<script type=\"text/javascript\" src=\"/subject/js/foot_ad.js?" + starTime + "-" + endTime + "_" + author + "\"></script>";
            }
            catch (ArgumentException ex)
            {
                isSucess = false;
                exception = ex;
            }
        }
    }
    public string strIdentify = null;
    public string fileName;
    public string keywords;
    public string description;
    public string title;
    public string defaultCss;
    public string mainImgRepeater;
    public string footScript;
    public string creatPageURL;
    public string cssLinks;
    public string fullPath;
    protected void Page_Load(object sender, EventArgs e)
    {
        try { strIdentify = Session["isLogin"].ToString(); }
        catch (Exception ex)
        {
			if(strIdentify!="identified ")
                Response.Redirect("/subject/edit/LoginFail.html");
        };
        String path=System.Web.HttpUtility.UrlDecode(Request["file"]);
        if (path != null)
        {
            fullPath = Server.MapPath("/subject" + "/" + path + "/");
            try
            {
                PageElement page = new PageElement(path, fullPath);
                if (!page.isSucess) {
                   Response.Write("<script>alert('意外错误！详细：" + page.exception + "')</script>");
                }
                fileName = page.fileName;
                title = page.title;
                keywords = page.keywords;
                description = page.description;
                defaultCss = page.defaultCss;
                mainImgRepeater = page.mainImgRepeater;
                footScript = page.footScript;
                cssLinks = page.cssLinksString;
            }
            catch (Exception ex)
            {
                Response.Write("<script>alert('意外错误！详细：" + ex + "')</script>");
            }
        }
        else {
            Response.Write("<script>alert('参数错误')</script>");
        }
    }
    protected void download_Click(object sender, EventArgs e)
    {
        try { strIdentify = Session["isLogin"].ToString(); }
        catch (Exception ex)
        {
			if(strIdentify!="identified ")
                Response.Redirect("/subject/edit/LoginFail.html");
        };
        string truePath = fullPath + "templates/index.tpl";
        if (File.Exists(truePath))
        {
            try
            {
                FileStream fileStream = new FileStream(truePath, FileMode.Open);
                long fileSize = fileStream.Length;
                Response.Clear();
                Response.ClearHeaders();
                Response.ContentType = "application/octet-stream";
                Response.AddHeader("Content-Disposition", "attachment;filename=index.html");
                Response.AppendHeader("Content-Length", fileSize.ToString());
                byte[] fileBuffer = new byte[fileSize];
                fileStream.Read(fileBuffer, 0, (int)fileSize);
                Response.BinaryWrite(fileBuffer);
                fileStream.Close();
                Response.End();
            }
            catch (Exception ex){
                Response.Write("<script>alert('发生致命错误，详情:"+ex+"');</script>");
            }
        }
        else {
            Response.Write("<script>alert('文件不存在或未生成tpl文件！');window.location.href=document.URL;</script>");
        }
    }
}