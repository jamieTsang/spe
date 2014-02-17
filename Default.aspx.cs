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
    protected void Page_Load(object sender, EventArgs e)
    {
        dayName = DateTime.Now.ToString("yyMMdd");
        try { strIdentify = Session["isLogin"].ToString(); }
        catch (Exception ex) {
			if(strIdentify!="identified ")
                Response.Redirect("/subject/edit/LoginFail.html");
        };
    }
    public string dayName;
    public string strIdentify = null;
    protected void Button1_Click(object sender, EventArgs e)
    {
        try { strIdentify = Session["isLogin"].ToString(); }
        catch (Exception ex)
        {
			if(strIdentify!="identified ")
                Response.Redirect("/subject/edit/LoginFail.html");
        };
        var fileName = "";
        fileName = TextBox0.Value;
        var title = TextBox1.Value;
        var keywords = TextBox2.Value;
        var description = TextBox3.Value;
        var imgNum = int.Parse(TextBox4.Value);
        var imgHeight = int.Parse(TextBox5.Value == "" ? "0" : TextBox5.Value);
        var lastImgHeight = int.Parse(TextBox6.Value == "" ? "0" : TextBox6.Value);
        var bgColor = TextBox7.Value;
        var bgHeight = TextBox8.Value;
        var bgURL = TextBox9.Value;
        var picLastName = drop1.Text;
        var mainWidth = TextBox10.Value;
        var soldOutY = TextBox11.Value;
        var starTime = Time1.Value;
        var endTime = Time2.Value;
        var author = TextBox12.Value;
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
                creatFile(scriptPath);
                if (creatFile(dataPath))
                {
                    //复制文件
                    string datasPath = sourcePath + "datas/";
                    if (coypFiles(datasPath, dataPath)) {
                        string xmlPath = dataPath+"page.config.xml";
                        try
                        {
                            var data = XDocument.Load(xmlPath);
                            var root = data.Element("root");
                            root.Element("fileName").Value=fileName;
                                root.Element("title").Value=title;
                                root.Element("keywords").Value = keywords;
                                root.Element("description").Value=description;
                                root.Element("imgNum").Value=imgNum.ToString();
                                root.Element("imgHeight").Value=imgHeight.ToString();
                                root.Element("lastImgHeight").Value=lastImgHeight.ToString();
                                root.Element("bgColor").Value=bgColor;
                                root.Element("bgHeight").Value=bgHeight;
                                root.Element("bgURL").Value=bgURL + picLastName;
                                root.Element("mainWidth").Value=mainWidth;
                                root.Element("soldOutY").Value=soldOutY;
                                root.Element("starTime").Value=starTime;
                                root.Element("endTime").Value=endTime;
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