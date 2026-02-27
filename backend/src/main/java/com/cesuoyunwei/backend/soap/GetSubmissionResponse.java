package com.cesuoyunwei.backend.soap;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "GetSubmissionResponse", namespace = "http://cesuoyunwei.com/forms")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetSubmissionResponse {
    public Long id;
    public Long templateId;
    public String dataJson;
    public Long submitterId;
    public String createdAt;
}
