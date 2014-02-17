<%@ WebHandler Language="C#" Class="edit" %>
//SPE编辑对象属性XML服务器程序 version_1.0.3 20131005
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Web;
using System.Linq;
using System.Xml.Linq;
using System.Text;
using System.Web.SessionState;
using System.Xml;
using System.IO;
using System.Web.Script.Serialization;

public class edit : IHttpHandler, IReadOnlySessionState
{

    public void ProcessRequest(HttpContext context)
    {
        context.Request.ContentEncoding = Encoding.GetEncoding("utf-8");
        context.Response.ContentEncoding = Encoding.GetEncoding("utf-8");
        string file = context.Request.Form["file"];
        string strId = context.Request.Form["id"];
        string paras = context.Server.UrlDecode(context.Request.Form["paras"]);
        string type = context.Request.Form["type"];
        string cmd = context.Request.Form["cmd"];
        string xmlPath = "/subject/" + file + "/datas/page.config.xml";
        try
        {
            var data = XDocument.Load(context.Server.MapPath(xmlPath));
            var root = data.Element("root");
            var objects = from l in root.Descendants("object")
                          where l.Attribute("id").Value == strId
                          select l;
            switch (cmd)
            {
                case "editObject":
                    editObjects(context, objects, paras);
                    break;
                case "deleteObject":
                    /*foreach (XElement detelObjcet in objects)
                    {*/
                    if (objects.First().Name.ToString() == null) { throw new ArgumentException("获取Object节点失败！"); }
                    else
                    {
                        objects.First().Remove();
                    }
                    //}
                    break;
                case "editChild":
                    var classes = root.Element("class");
                    if (type == "remark")
                    {
                        Match editChildNum = new Regex(@"num:'(\d+)'", RegexOptions.IgnoreCase).Match(paras);
                        if (editChildNum.Success)
                        {
                            var r = editChildNum.Groups[1].Value;
                            var remarks = classes.Element("remark").Elements("r" + r);
                            editObjects(context, remarks, paras);
                        }
                        else
                        {
                            throw new ArgumentException("获取修改备注参数失败！");
                        }
                    }
                    else
                    {
                        var names = classes.Elements(type);
                        editObjects(context, names, paras);
                    }
                    break;
                case "deleteChild":
                    Match deleteChildNum = new Regex(@"deleteChildNum:'(\d+)'", RegexOptions.IgnoreCase).Match(paras);
                    if (deleteChildNum.Success)
                    {
                        var r = int.Parse(deleteChildNum.Groups[1].Value);
                        foreach (XElement detelObjcet in objects)
                        {
                            detelObjcet.Element("childNode").Elements().ElementAt(r).Remove();
                            //context.Response.Write(detelObjcet.Element("childNode").Elements().Skip(r).First().Name);
                        }
                    }
                    else
                    {
                        throw new ArgumentException("获取删除备注参数失败！");
                    }
                    break;
                case "addLineContent":
                    root.Add(addLineContent(context, objects, paras, strId));
                    break;
                case "addPosaTextArea":
                    root.Add(addTextArea(context, objects, paras, strId));
                    break;
                case "addPosaLink":
                    root.Add(addPosaLink(context, objects, paras, strId));
                    break;
                case "addPosaUpdate":
                    root.Add(addUpdate(context, objects, paras, strId));
                    break;
                case "addCssLink":
                    root.Add(addCssLink(context, objects, paras, strId));
                    break;
                case "addJsLink":
                    root.Add(addJsLink(context, objects, paras, strId));
                    break;
                case "addPosaDiv":
                    root.Add(addPosaDiv(context, objects, paras, strId));
                    break;
                case "addChildClass":
                    Regex regex2 = new Regex(@"num:'(\d+)'", RegexOptions.IgnoreCase);
                    var m2 = regex2.Match(paras).Groups[1].Value;
                    root.Element("class").Element("remark").Add(new XElement("r" + m2, new XElement("width", 180), new XElement("height", 20), new XElement("top", 0), new XElement("left", 0), new XElement("font-family", "Microsoft YaHei"), new XElement("font-size", 12), new XElement("font-weight", "normal"), new XElement("line-height", 26), new XElement("color", "#000")));
                    break;
                default:
                    context.Response.Write("False");
                    break;
            }
            data.Save(context.Server.MapPath(xmlPath));//保存。
            context.Response.Write("True");
        }
        catch (ArgumentException ex)
        {
            context.Response.Write(ex);
        }
    }
    private void editObjects(HttpContext context, IEnumerable<XElement> objects, string paras)
    {
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        Dictionary<string, object> json = (Dictionary<string, object>)serializer.DeserializeObject(paras);
        foreach (KeyValuePair<string, object> item in json)
        {
            if (item.Key == "addChildNode")
            {
                addChlidNode(context, objects, item.Value);
            }
            else
            {
                editObject(context, objects, item.Key, item.Value);
            }
        }
    }
    private XElement addLineContent(HttpContext context, IEnumerable<XElement> objects, string paras, string strId)
    {
        XElement newNode = new XElement("object", new XAttribute("id", strId), new XElement("type", "lineContent"), new XElement("class", ""));
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        Dictionary<string, object> json = (Dictionary<string, object>)serializer.DeserializeObject(paras);
        foreach (KeyValuePair<string, object> item in json)
        {
            if (item.Key == "childNode")
            {
                var title = new XElement("title", new XAttribute("object", false));
                var price = new XElement("price", new XAttribute("object", false));
                var link = new XElement("link", new XAttribute("object", false));
                var remark = new XElement("remark", new XAttribute("object", false));
                newNode.Add(new XElement("childNode", title, price, link, remark));
            }
            else
            {
                newNode.Add(new XElement(item.Key, item.Value.ToString()));
            }
        }
        return newNode;
    }
    private XElement addTextArea(HttpContext context, IEnumerable<XElement> objects, string paras, string strId)
    {
        XElement newNode = new XElement("object", new XAttribute("id", strId), new XElement("type", "posaTextArea"), new XElement("class", ""), new XElement("content", "点击编辑该对象属性"));
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        Dictionary<string, object> json = (Dictionary<string, object>)serializer.DeserializeObject(paras);
        foreach (KeyValuePair<string, object> item in json)
        {
            newNode.Add(new XElement(item.Key, item.Value.ToString()));
        }
        return newNode;
    }
    private XElement addUpdate(HttpContext context, IEnumerable<XElement> objects, string paras, string strId)
    {
        XElement newNode = new XElement("object", new XAttribute("id", strId), new XElement("type", "posaUpdate"), new XElement("class", ""));
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        Dictionary<string, object> json = (Dictionary<string, object>)serializer.DeserializeObject(paras);
        foreach (KeyValuePair<string, object> item in json)
        {
            newNode.Add(new XElement(item.Key, item.Value.ToString()));
        }
        return newNode;
    }
    private XElement addPosaLink(HttpContext context, IEnumerable<XElement> objects, string paras, string strId)
    {
        XElement newNode = new XElement("object", new XAttribute("id", strId), new XElement("type", "posaLink"), new XElement("class", ""), new XElement("content", "点击编辑该对象属性"), new XElement("href", "javascript:void(0);"), new XElement("target", "_blank"), new XElement("title", "点击编辑该对象属性"));
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        Dictionary<string, object> json = (Dictionary<string, object>)serializer.DeserializeObject(paras);
        foreach (KeyValuePair<string, object> item in json)
        {
            newNode.Add(new XElement(item.Key, item.Value.ToString()));
        }
        return newNode;
    }
    private XElement addCssLink(HttpContext context, IEnumerable<XElement> objects, string paras, string strId)
    {
        XElement newNode = new XElement("object", new XAttribute("id", strId), new XElement("type", "cssLink"), new XElement("class", ""), new XElement("href", "/subject/130101_xxx/css/css.css"));
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        Dictionary<string, object> json = (Dictionary<string, object>)serializer.DeserializeObject(paras);
        foreach (KeyValuePair<string, object> item in json)
        {
            newNode.Add(new XElement(item.Key, item.Value.ToString()));
        }
        return newNode;
    }
    private XElement addJsLink(HttpContext context, IEnumerable<XElement> objects, string paras, string strId)
    {
        XElement newNode = new XElement("object", new XAttribute("id", strId), new XElement("type", "jsLink"), new XElement("class", ""), new XElement("href", "/subject/130101_xxx/scripts/default.js"));
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        Dictionary<string, object> json = (Dictionary<string, object>)serializer.DeserializeObject(paras);
        foreach (KeyValuePair<string, object> item in json)
        {
            newNode.Add(new XElement(item.Key, item.Value.ToString()));
        }
        return newNode;
    }
    private XElement addPosaDiv(HttpContext context, IEnumerable<XElement> objects, string paras, string strId)
    {
        XElement newNode = new XElement("object", new XAttribute("id", strId), new XElement("type", "posaDiv"), new XElement("class", ""), new XElement("code", "点击编辑该对象属性"));
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        Dictionary<string, object> json = (Dictionary<string, object>)serializer.DeserializeObject(paras);
        foreach (KeyValuePair<string, object> item in json)
        {
            newNode.Add(new XElement(item.Key, item.Value.ToString()));
        }
        return newNode;
    }
    private void editObject(HttpContext context, IEnumerable<XElement> objects, string str, object value)
    {
        if (value.ToString() != "undefined" && str != "num")
        {
            try
            {
                foreach (var elem in objects)
                {
                    elem.Element(str).Value = value.ToString();
                }
            }
            catch
            {
                context.Response.Write("False");
            }
        }
    }
    private void addChlidNode(HttpContext context, IEnumerable<XElement> objects, object value)
    {
        if (value.ToString() != null)
        {
            var childNode = (from ch in objects.Descendants("childNode")
                             select ch).First();
            Array nodes = value.ToString().Split(new char[1] { ',' });
            foreach (var node in nodes)
            {
                childNode.Add(new XElement(node.ToString(), new XAttribute("object", "false")));
            }
        }
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}