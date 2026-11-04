/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.dto;

public class TagDTO {
    private Integer tagId;
    private String tagName;
    private String note;

    public TagDTO() {
    }

    public TagDTO(Integer tagId, String tagName, String note) {
        this.tagId = tagId;
        this.tagName = tagName;
        this.note = note;
    }

    public Integer getTagId() {
        return tagId;
    }

    public void setTagId(Integer tagId) {
        this.tagId = tagId;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}

