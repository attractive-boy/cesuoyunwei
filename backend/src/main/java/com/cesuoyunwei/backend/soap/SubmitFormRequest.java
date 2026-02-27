package com.cesuoyunwei.backend.soap;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "SubmitFormRequest", namespace = "http://cesuoyunwei.com/forms")
@XmlAccessorType(XmlAccessType.FIELD)
public class SubmitFormRequest {
    public Long templateId;
    public String dataJson;
    public Long submitterId;
}
