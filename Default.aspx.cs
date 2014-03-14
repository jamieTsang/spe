using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.SessionState;
using System.IO;
using System.Text;
using System.Xml;

public partial class subject_edit_spe_Default : System.Web.UI.Page
{
    public class PageElement
    {
        public string fileName;
        public string title;
        public string keywords;
        public string description;
        public string starTime;
        public string endTime;
        public string author;
        public bool isSucess = true;
        public ArgumentException exception;
        public PageElement(string path, string fullPath)
        {
            this.fileName = path;
            try
            {
                string xmlPath = fullPath + "datas/page.config.xml";
                var data = XDocument.Load(xmlPath);
                var root = data.Element("root");
                this.title = root.Element("title").Value;
                this.keywords = root.Element("keywords").Value;
                this.description = root.Element("description").Value;
                this.starTime = root.Element("starTime").Value;
                this.endTime = root.Element("endTime").Value;
                this.author = root.Element("author").Value;
            }
            catch (ArgumentException ex)
            {
                isSucess = false;
                exception = ex;
            }
        }
    }
    public string dayName;
    public string strIdentify = null;
    public string path;
    public string fullPath;
    protected void Page_Load(object sender, EventArgs e)
    {
        dayName = DateTime.Now.ToString("yyMMdd");
        try { strIdentify = Session["isLogin"].ToString(); }
        catch (Exception ex) {
			if(strIdentify!="identified ")
                Response.Redirect("/subject/edit/LoginFail.html");
        };
        path = System.Web.HttpUtility.UrlDecode(Request["file"]);
        if (path != null)
        {
            path = System.Web.HttpUtility.UrlDecode(Request["file"]);
            fullPath = Server.MapPath("/subject/" + path + "/");
            PageElement page = new PageElement(path, fullPath);
            if (!page.isSucess)
            {
                Response.Write("<script>alert('意外错误！详细：" + page.exception + "')</script>");
            }
            FileName.Disabled = true;
            FileName.Value = page.fileName;
            Button1.Text = "完成修改";
        }
        else
        {
            Button1.Text = "生成文件";
        }
    }
    protected void Button1_Click(object sender, EventArgs e)
    {
        {
            var fileName = "";
            fileName = FileName.Value;
            var title = Title.Value;
            var keywords = Keyword.Value;
            var description = Description.Value;
            var bgColor = bgColor.Value;
            var bgHeight = bgHeight.Value;
            var bgURL = bgURL.Value;
            var soldOutY = soldOutY.Value;
            var starTime = Time1.Value;
            var endTime = Time2.Value;
            var author = Author.Value;
            if (path == null)
            {
                try { strIdentify = Session["isLogin"].ToString(); }
                catch (Exception ex)
                {
                    if (strIdentify != "identified ")
                        Response.Redirect("LoginFail.html");
                };
                //生成文件夹
                string FileFullPath = "/subject/" + dayName + "_" + fileName + "/";
                string FullNamePath = Server.MapPath(FileFullPath);
                string sourcePath = Server.MapPath("/subject/edit/spe/");
                string imagesPath = FullNamePath + "images/";
                string scriptPath = FullNamePath + "scripts/";
                string dataPath = FullNamePath + "datas/";
                string templatePath = FullNamePath + "templates/";
                if (creatFile(FullNamePath))
                {
                    creatFile(imagesPath);
                    if (creatFile(scriptPath))
                    {
                        string scriptsPath = sourcePath + "scripts/";
                        coypFiles(scriptsPath, scriptPath);
                    }
                    if (creatFile(dataPath))
                    {
                        //复制文件
                        string datasPath = sourcePath + "datas/";
                        if (coypFiles(datasPath, dataPath))
                        {
                            string xmlPath = dataPath + "page.config.xml";
                            try
                            {
                                var data = XDocument.Load(xmlPath);
                                var root = data.Element("root");
                                root.Element("fileName").Value = fileName;
                                root.Element("title").Value = title;
                                root.Element("keywords").Value = keywords;
                                root.Element("description").Value = description;
                                root.Element("bgColor").Value = bgColor;
                                root.Element("bgHeight").Value = bgHeight;
                                root.Element("bgURL").Value = bgURL;
                                root.Element("soldOutY").Value = soldOutY;
                                root.Element("starTime").Value = starTime;
                                root.Element("endTime").Value = endTime;
                                root.Element("author").Value = author.ToString();
                                data.Save(xmlPath);//保存。
                            }
                            catch (ArgumentException ex)
                            {
                                Response.Write(ex);
                            }
                        };
                    };
                    creatFile(templatePath);
                    Response.Redirect("/subject/edit/spe/Editor.aspx?file=" + dayName + "_" + fileName);
                }
                else
                {
                    //执行提示Javascript
                    var sumbitScript = "alert('目标文件夹已存在！')";
                    Page.ClientScript.RegisterOnSubmitStatement(this.GetType(), "myKey", sumbitScript);
                };
            }
            else
            {
                string xmlPath = fullPath + "/datas/page.config.xml";
                try
                {
                    var data = XDocument.Load(xmlPath);
                    var root = data.Element("root");
                    if (Title.Value != null)
                        root.Element("title").Value = Title.Value;
                    if (Keyword.Value != null)
                        root.Element("keywords").Value = Keyword.Value;
                    if (Description.Value != null)
                        root.Element("description").Value = Description.Value;
                    if (bgColor.Value!=null)
                        root.Element("bgColor").Value = bgColor.Value;
                    if (bgHeight.Value != null)
                        root.Element("bgHeight").Value = bgHeight.Value;
                    if (bgURL.Value != null)
                        root.Element("bgURL").Value = bgURL.Value;
                    if (soldOutY.Value != null)
                        root.Element("soldOutY").Value = soldOutY.Value;
                    if (Time1.Value != null)
                        root.Element("starTime").Value = Time1.Value;
                    if (Time2.Value != null)
                        root.Element("endTime").Value = Time2.Value;
                    if (Author.Value != null)
                        root.Element("author").Value = Author.Value;
                    data.Save(xmlPath);//保存。
                    Response.Redirect("/subject/edit/spe/Editor.aspx?file=" + fileName);
                }
                catch (ArgumentException ex)
                {
                    Response.Write("alert('读取错误！详细" + ex + "')");
                }
            }
        }
    }
    private bool creatFile(string fileName)
    {
        if (!Directory.Exists(fileName))
        {
            Directory.CreateDirectory(fileName);
            return true;
        }
        else { return false; }
    }
    private bool coypFiles(string sourcePath, string targetPath)
    {
        string destFile;
        if (Directory.Exists(targetPath))
        {
            string[] files = Directory.GetFiles(sourcePath);
            foreach (string s in files)
            {
                destFile = Path.Combine(targetPath, Path.GetFileName(s));
                File.Copy(s, destFile, true);
            }
            return true;
        }
        else { return false; }
    }
}